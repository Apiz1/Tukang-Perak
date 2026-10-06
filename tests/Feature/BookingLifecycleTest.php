<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private function makeBookingSetup(): array
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->provider()->create();
        $providerProfile = ProviderProfile::factory()->create(['user_id' => $providerUser->id]);
        $service = Service::factory()->create(['provider_profile_id' => $providerProfile->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
            'status' => 'requested',
        ]);

        return compact('customer', 'providerUser', 'providerProfile', 'service', 'booking');
    }

    public function test_provider_can_accept_a_requested_booking(): void
    {
        ['providerUser' => $providerUser, 'booking' => $booking] = $this->makeBookingSetup();

        $response = $this->actingAs($providerUser)
            ->patch(route('provider.bookings.accept', $booking));

        $response->assertRedirect();
        $this->assertEquals('accepted', $booking->fresh()->status);
    }

    public function test_provider_cannot_accept_an_already_accepted_booking(): void
    {
        ['providerUser' => $providerUser, 'booking' => $booking] = $this->makeBookingSetup();
        $booking->update(['status' => 'accepted']);

        $response = $this->actingAs($providerUser)
            ->patch(route('provider.bookings.accept', $booking));

        $response->assertForbidden();
    }

    public function test_provider_cannot_mark_work_done_before_payment_is_held(): void
    {
        ['providerUser' => $providerUser, 'booking' => $booking] = $this->makeBookingSetup();
        $booking->update(['status' => 'accepted']);
        // no payment created at all

        $response = $this->actingAs($providerUser)
            ->patch(route('provider.bookings.mark-work-done', $booking));

        $response->assertForbidden();
        $this->assertEquals('accepted', $booking->fresh()->status);
    }

    public function test_full_fixed_price_lifecycle_releases_payment_on_confirm(): void
    {
        ['customer' => $customer, 'providerUser' => $providerUser, 'booking' => $booking] = $this->makeBookingSetup();

        $booking->update(['status' => 'accepted']);

        $payment = Payment::factory()->held()->create([
            'booking_id' => $booking->id,
            'amount' => $booking->price,
        ]);


        // Provider marks work done
        $this->actingAs($providerUser)
            ->patch(route('provider.bookings.mark-work-done', $booking))
            ->assertRedirect();

        $this->assertEquals('work_done', $booking->fresh()->status);

        // Customer confirms
        $this->actingAs($customer)
            ->patch(route('customer.bookings.confirm', $booking))
            ->assertRedirect();

        $booking->refresh();
        $payment->refresh();

        $this->assertEquals('completed', $booking->status);
        $this->assertEquals('released', $payment->status);
        $this->assertNotNull($payment->released_at);
    }

    public function test_customer_can_dispute_instead_of_confirming(): void
    {
        ['customer' => $customer, 'providerUser' => $providerUser, 'booking' => $booking] = $this->makeBookingSetup();

        $booking->update(['status' => 'work_done']);
        $payment = Payment::factory()->held()->create([
            'booking_id' => $booking->id,
        ]);

        $this->actingAs($customer)
            ->post(route('customer.bookings.dispute', $booking), [
                'reason' => 'Kerja tidak siap sepenuhnya',
            ])
            ->assertRedirect();

        $payment->refresh();

        $this->assertEquals('disputed', $payment->status);
        $this->assertEquals('Kerja tidak siap sepenuhnya', $payment->dispute_reason);
    }
}