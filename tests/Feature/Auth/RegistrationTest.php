<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\AdminAlertNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $this->get('/register')->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone_number' => '0123456789',
            'role' => 'customer',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard.redirect', absolute: false));
        $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'role' => 'customer']);
    }

    public function test_nobody_can_register_as_admin(): void
    {
        $response = $this->post('/register', [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'phone_number' => '0123456789',
            'role' => 'admin',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'sneaky@example.com']);
    }

    public function test_provider_must_give_category_district_and_identity_document(): void
    {
        $response = $this->post('/register', [
            'name' => 'Tukang',
            'email' => 'tukang@example.com',
            'phone_number' => '0123456789',
            'role' => 'provider',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors(['category', 'district', 'identity_document']);
        $this->assertDatabaseMissing('users', ['email' => 'tukang@example.com']);
    }

    public function test_provider_registers_as_pending_and_admins_are_alerted(): void
    {
        Storage::fake('local');
        Storage::fake('public');
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);

        $this->post('/register', [
            'name' => 'Tukang Aircon',
            'email' => 'tukang@example.com',
            'phone_number' => '0123456789',
            'role' => 'provider',
            'category' => 'aircon',
            'district' => 'Parit Buntar',
            'identity_document' => UploadedFile::fake()->create('ic.pdf', 100, 'application/pdf'),
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertSessionHasNoErrors();

        $user = User::where('email', 'tukang@example.com')->first();

        $this->assertDatabaseHas('provider_profiles', [
            'user_id' => $user->id,
            'status' => 'pending',
        ]);

        Notification::assertSentTo($admin, AdminAlertNotification::class);
    }
}