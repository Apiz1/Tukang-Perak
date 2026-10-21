<?php

namespace Tests\Feature;

use App\Models\ProviderProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProviderDocumentAccessTest extends TestCase
{
    use RefreshDatabase;

    private function profileWithDocument(): array
    {
        Storage::fake('local');

        $profile = ProviderProfile::factory()->create();
        $path = "provider-documents/{$profile->id}/ic.pdf";
        Storage::disk('local')->put($path, 'fake pdf');

        $document = $profile->documents()->create([
            'type' => 'identity',
            'file_path' => $path,
            'original_name' => 'ic.pdf',
        ]);

        return [$profile, $document];
    }

    public function test_admin_can_open_a_provider_document(): void
    {
        [$profile, $document] = $this->profileWithDocument();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.providers.documents.show', [$profile, $document]))
            ->assertOk();
    }

    public function test_customer_and_provider_cannot_open_a_document(): void
    {
        [$profile, $document] = $this->profileWithDocument();
        $url = route('admin.providers.documents.show', [$profile, $document]);

        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer)->get($url)->assertForbidden();

        // the owner of the document is blocked too
        $profile->user->update(['role' => 'provider']);
        $this->actingAs($profile->user)->get($url)->assertForbidden();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        [$profile, $document] = $this->profileWithDocument();

        $this->get(route('admin.providers.documents.show', [$profile, $document]))
            ->assertRedirect(route('login'));
    }

    public function test_document_from_another_provider_is_not_found(): void
    {
        [$profile, $document] = $this->profileWithDocument();
        $other = ProviderProfile::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get(route('admin.providers.documents.show', [$other, $document]))
            ->assertNotFound();
    }
}