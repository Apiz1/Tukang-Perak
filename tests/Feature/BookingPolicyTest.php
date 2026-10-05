<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_view_another_customers_booking(): void
    {
        $customerA = User::factory()->create(['role' => 'customer']);
        $customerB = User::factory()->create(['role' => 'customer']);

        $providerUser = User::factory()->create(['role' => 'provider']);
        $providerProfile = ProviderProfile::factory()->create([
            'user_id' => $providerUser->id,
            'status' => 'approved',
        ]);
        $service = Service::factory()->create(['provider_profile_id' => $providerProfile->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customerA->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
        ]);

        $response = $this->actingAs($customerB)
            ->get(route('customer.bookings.show', $booking));

        $response->assertForbidden();
    }

    public function test_customer_can_view_their_own_booking(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $providerUser = User::factory()->create(['role' => 'provider']);
        $providerProfile = ProviderProfile::factory()->create([
            'user_id' => $providerUser->id,
            'status' => 'approved',
        ]);
        $service = Service::factory()->create(['provider_profile_id' => $providerProfile->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
        ]);

        $response = $this->actingAs($customer)
            ->get(route('customer.bookings.show', $booking));

        $response->assertOk();
    }
}