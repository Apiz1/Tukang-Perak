<?php

namespace Tests\Feature;

use App\Models\ProviderProfile;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_report_a_provider(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $profile = ProviderProfile::factory()->create();

        $this->assertTrue($customer->can('create', [Report::class, $profile]));
    }

    public function test_customer_cannot_report_same_provider_twice_while_pending(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $profile = ProviderProfile::factory()->create();

        Report::factory()->create([
            'reporter_id' => $customer->id,
            'provider_id' => $profile->user_id,
            'status' => 'pending',
        ]);

        $this->assertFalse($customer->can('create', [Report::class, $profile]));
    }

    public function test_customer_can_report_again_after_previous_report_is_resolved(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $profile = ProviderProfile::factory()->create();

        Report::factory()->create([
            'reporter_id' => $customer->id,
            'provider_id' => $profile->user_id,
            'status' => 'dismissed',
        ]);

        $this->assertTrue($customer->can('create', [Report::class, $profile]));
    }

    public function test_customer_cannot_report_themselves(): void
    {
        $profile = ProviderProfile::factory()->create();
        $user = $profile->user;
        $user->update(['role' => 'customer']);

        $this->assertFalse($user->can('create', [Report::class, $profile]));
    }

    public function test_only_customers_can_create_reports(): void
    {
        $profile = ProviderProfile::factory()->create();
        $admin = User::factory()->create(['role' => 'admin']);
        $otherProvider = User::factory()->create(['role' => 'provider']);

        $this->assertFalse($admin->can('create', [Report::class, $profile]));
        $this->assertFalse($otherProvider->can('create', [Report::class, $profile]));
    }

    public function test_only_admin_can_review_reports(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);
        $provider = User::factory()->create(['role' => 'provider']);

        $this->assertTrue($admin->can('review', Report::class));
        $this->assertFalse($customer->can('review', Report::class));
        $this->assertFalse($provider->can('review', Report::class));
    }
}