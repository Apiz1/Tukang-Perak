<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\ProviderProfile;
use App\Models\User;
use App\Models\Booking;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_record_stores_actor_subject_and_details(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $profile = ProviderProfile::factory()->create();

        $this->actingAs($admin);

        ActivityLog::record('provider.approved', 'Tukang diluluskan', $profile, ['reason' => 'ok']);

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'action' => 'provider.approved',
            'subject_type' => $profile->getMorphClass(),
            'subject_id' => $profile->id,
        ]);

        $this->assertSame(['reason' => 'ok'], ActivityLog::first()->properties);
    }

    public function test_record_works_without_a_logged_in_user(): void
    {
        ActivityLog::record('auth.login_failed', 'Log masuk gagal');

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => null,
            'action' => 'auth.login_failed',
        ]);
    }

    public function test_successful_and_failed_logins_are_logged(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'wrong-password']);
        $this->assertDatabaseHas('activity_logs', ['action' => 'auth.login_failed']);

        $this->post('/login', ['email' => $user->email, 'password' => 'password']);
        $this->assertDatabaseHas('activity_logs', ['action' => 'auth.login', 'user_id' => $user->id]);
    }

    public function test_registration_is_logged(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'new@example.com',
            'phone_number' => '0123456789',
            'role' => 'customer',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertDatabaseHas('activity_logs', ['action' => 'user.registered']);
    }

    public function test_admin_approving_a_provider_is_logged(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $profile = ProviderProfile::factory()->create(['status' => 'pending']);
        $profile->documents()->create(['type' => 'identity', 'file_path' => 'x.pdf', 'original_name' => 'x.pdf']);

        $this->actingAs($admin)->patch(route('admin.providers.approve', $profile));

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'provider.approved',
            'user_id' => $admin->id,
            'subject_id' => $profile->id,
        ]);
    }

    public function test_invalid_billplz_signature_is_logged_as_a_security_event(): void
    {
        $this->post('/billplz/callback', ['id' => 'bill_123', 'x_signature' => 'bad'])
            ->assertForbidden();

        $this->assertDatabaseHas('activity_logs', ['action' => 'security.billplz_invalid_signature']);
    }

    public function test_cancelling_a_booking_is_logged(): void
    {
        $booking = Booking::factory()->create(['status' => 'requested']);
        $booking->customer->update(['role' => 'customer']);

        $this->actingAs($booking->customer)
            ->patch(route('customer.bookings.cancel', $booking))
            ->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'booking.cancelled',
            'subject_id' => $booking->id,
        ]);
    }

    public function test_payment_held_is_logged_only_once(): void
    {
        $booking = Booking::factory()->create();
        $payment = $booking->payments()->create(['amount' => 100, 'platform_fee' => 10, 'provider_amount' => 90]);

        $payment->markAsHeld();
        $payment->markAsHeld(); // a repeated callback

        $this->assertSame(1, \App\Models\ActivityLog::where('action', 'payment.held')->count());
    }

    public function test_admin_refund_is_logged_with_the_admin_note(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $booking = Booking::factory()->create();
        $payment = $booking->payments()->create(['amount' => 100, 'platform_fee' => 10, 'provider_amount' => 90]);
        $payment->update(['status' => 'disputed']);

        $this->actingAs($admin)
            ->patch(route('admin.payments.refund', $payment), ['admin_note' => 'Kerja tidak siap'])
            ->assertRedirect();

        $this->assertDatabaseHas('activity_logs', [
            'action' => 'payment.refunded',
            'user_id' => $admin->id,
            'subject_id' => $payment->id,
        ]);
    }

    public function test_customer_suspension_is_logged_and_only_works_on_customers(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);
        $otherAdmin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->patch(route('admin.customers.suspend', $customer), ['suspension_reason' => 'Spam'])
            ->assertRedirect();

        $this->assertDatabaseHas('activity_logs', ['action' => 'customer.suspended', 'subject_id' => $customer->id]);

        $this->actingAs($admin)
            ->patch(route('admin.customers.suspend', $otherAdmin), ['suspension_reason' => 'x'])
            ->assertNotFound();
    }

    public function test_admin_can_view_and_filter_the_activity_log(): void
{
    $admin = User::factory()->create(['role' => 'admin']);
    ActivityLog::record('security.amount_mismatch', 'Jumlah tidak sepadan');
    ActivityLog::record('auth.login', 'Seseorang log masuk');

    $this->actingAs($admin)
        ->get(route('admin.activity-logs.index', ['category' => 'security']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/ActivityLogs/Index')
            ->has('logs.data', 1)
        );
}

public function test_customers_cannot_open_the_activity_log(): void
{
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('admin.activity-logs.index'))
        ->assertForbidden();
}

    public function test_unknown_category_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.activity-logs.index', ['category' => "x' OR 1=1"]))
            ->assertSessionHasErrors('category');
    }

    public function test_old_logs_are_pruned_and_recent_ones_are_kept(): void
    {
        ActivityLog::create([
            'action' => 'auth.login',
            'description' => 'old entry',
            'created_at' => now()->subDays(ActivityLog::RETENTION_DAYS + 1),
        ]);
        ActivityLog::create([
            'action' => 'auth.login',
            'description' => 'recent entry',
            'created_at' => now()->subDays(5),
        ]);

        $this->artisan('model:prune', ['--model' => ActivityLog::class])->assertSuccessful();

        $this->assertDatabaseMissing('activity_logs', ['description' => 'old entry']);
        $this->assertDatabaseHas('activity_logs', ['description' => 'recent entry']);
    }

    public function test_dashboard_shows_the_ten_latest_activities_without_plain_logins(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        foreach (range(1, 12) as $i) {
            ActivityLog::record('booking.status_changed', "Tempahan #{$i}");
        }
        ActivityLog::record('auth.login', 'Noise');

        $this->actingAs($admin)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->has('recentActivity', 10)
                ->where('recentActivity.0.title', 'Tempahan #12')
            );
    }
}