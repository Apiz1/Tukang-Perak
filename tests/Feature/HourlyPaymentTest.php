<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HourlyPaymentTest extends TestCase
{
    use RefreshDatabase;

    private function makeHourlyBookingSetup(): array
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->provider()->create();
        $providerProfile = ProviderProfile::factory()->create(['user_id' => $providerUser->id]);
        $service = Service::factory()->hourly()->create([
            'provider_profile_id' => $providerProfile->id,
            'base_price' => 25, // RM25/hour
        ]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
            'status' => 'accepted',
            'price' => 25,
        ]);

        return compact('customer', 'providerUser', 'providerProfile', 'service', 'booking');
    }

    public function test_provider_must_log_hours_to_mark_hourly_booking_as_work_done(): void
    {
        ['providerUser' => $providerUser, 'booking' => $booking] = $this->makeHourlyBookingSetup();

        $response = $this->actingAs($providerUser)
            ->patch(route('provider.bookings.mark-work-done', $booking), []); // no hours_worked

        $response->assertSessionHasErrors('hours_worked');
        $this->assertEquals('accepted', $booking->fresh()->status);
    }

    public function test_provider_can_mark_hourly_booking_done_with_hours_logged(): void
    {
        ['providerUser' => $providerUser, 'booking' => $booking] = $this->makeHourlyBookingSetup();

        $this->actingAs($providerUser)
            ->patch(route('provider.bookings.mark-work-done', $booking), [
                'hours_worked' => 3.5,
            ])
            ->assertRedirect();

        $booking->refresh();

        $this->assertEquals('work_done', $booking->status);
        $this->assertEquals(3.5, $booking->hours_worked);
    }

    public function test_customer_cannot_pay_hourly_booking_before_work_is_done(): void
    {
        ['customer' => $customer, 'booking' => $booking] = $this->makeHourlyBookingSetup();
        // status is still 'accepted', hours not logged

        $response = $this->actingAs($customer)
            ->post(route('customer.bookings.pay', $booking));

        $response->assertForbidden();
    }

    public function test_final_amount_is_calculated_from_hours_times_rate(): void
    {
        ['booking' => $booking] = $this->makeHourlyBookingSetup();
        $booking->update(['hours_worked' => 4]);

        // price is 25/hour, 4 hours logged
        $this->assertEquals(100.0, $booking->fresh()->finalAmount());
    }
}