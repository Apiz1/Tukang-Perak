<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AutoConfirmBookingsTest extends TestCase
{
    use RefreshDatabase;

    private function makeWorkDoneBooking(\Carbon\Carbon $updatedAt): Booking
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->provider()->create();
        $providerProfile = ProviderProfile::factory()->create(['user_id' => $providerUser->id]);
        $service = Service::factory()->create(['provider_profile_id' => $providerProfile->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
            'status' => 'work_done',
        ]);

        Payment::factory()->held()->create([
            'booking_id' => $booking->id,
            'amount' => $booking->price,
        ]);

        // bypass Eloquent's auto-timestamping, same fix from our tinker debugging session
        \DB::table('bookings')->where('id', $booking->id)->update(['updated_at' => $updatedAt]);

        return $booking->fresh();
    }

    public function test_auto_confirms_bookings_stuck_past_48_hours(): void
    {
        $booking = $this->makeWorkDoneBooking(now()->subHours(49));

        $this->artisan('bookings:auto-confirm')
            ->expectsOutputToContain("Auto-confirmed booking #{$booking->id}")
            ->assertExitCode(0);

        $booking->refresh();

        $this->assertEquals('completed', $booking->status);
        $this->assertEquals('released', $booking->payment->status);
    }

    public function test_does_not_touch_bookings_under_48_hours(): void
    {
        $booking = $this->makeWorkDoneBooking(now()->subHours(10));

        $this->artisan('bookings:auto-confirm')
            ->assertExitCode(0);

        $booking->refresh();

        $this->assertEquals('work_done', $booking->status);
        $this->assertEquals('held', $booking->payment->status);
    }

    public function test_does_not_touch_bookings_without_held_payment(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $providerUser = User::factory()->provider()->create();
        $providerProfile = ProviderProfile::factory()->create(['user_id' => $providerUser->id]);
        $service = Service::factory()->create(['provider_profile_id' => $providerProfile->id]);

        $booking = Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $providerProfile->id,
            'service_id' => $service->id,
            'status' => 'work_done',
        ]);
        // no payment created at all

        \DB::table('bookings')->where('id', $booking->id)->update(['updated_at' => now()->subHours(49)]);

        $this->artisan('bookings:auto-confirm')
            ->assertExitCode(0);

        $this->assertEquals('work_done', $booking->fresh()->status);
    }
}