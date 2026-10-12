<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingCreationTest extends TestCase
{
    use RefreshDatabase;

    private function payload(?string $date = null): array
    {
        return [
            'preferred_date' => $date ?? now()->addDays(3)->toDateString(),
            'district' => 'parit_buntar',
            'address' => '12 Jalan Test',
        ];
    }

    public function test_customer_cannot_book_same_service_on_same_date_twice(): void
    {
        $customer = User::factory()->create();
        $service = Service::factory()->create();

        $this->actingAs($customer)
            ->post(route('services.book.store', $service), $this->payload())
            ->assertRedirect();

        $this->actingAs($customer)
            ->post(route('services.book.store', $service), $this->payload())
            ->assertSessionHasErrors('preferred_date');

        $this->assertDatabaseCount('bookings', 1);
    }

    public function test_customer_can_book_same_service_on_a_different_date(): void
    {
        $customer = User::factory()->create();
        $service = Service::factory()->create();

        $this->actingAs($customer)
            ->post(route('services.book.store', $service), $this->payload(now()->addDays(3)->toDateString()));
        $this->actingAs($customer)
            ->post(route('services.book.store', $service), $this->payload(now()->addDays(4)->toDateString()))
            ->assertSessionDoesntHaveErrors();

        $this->assertDatabaseCount('bookings', 2);
    }

    public function test_customer_can_rebook_after_cancelling(): void
    {
        $customer = User::factory()->create();
        $service = Service::factory()->create();
        $date = now()->addDays(3)->toDateString();

        Booking::factory()->create([
            'customer_id' => $customer->id,
            'provider_profile_id' => $service->provider_profile_id,
            'service_id' => $service->id,
            'preferred_date' => $date,
            'status' => 'cancelled',
        ]);

        $this->actingAs($customer)
            ->post(route('services.book.store', $service), $this->payload($date))
            ->assertSessionDoesntHaveErrors();

        $this->assertDatabaseCount('bookings', 2);
    }

    public function test_two_different_customers_can_book_the_same_service_and_date(): void
    {
        $service = Service::factory()->create();
        $a = User::factory()->create();
        $b = User::factory()->create();

        $this->actingAs($a)->post(route('services.book.store', $service), $this->payload());
        $this->actingAs($b)->post(route('services.book.store', $service), $this->payload())
            ->assertSessionDoesntHaveErrors();

        $this->assertDatabaseCount('bookings', 2);
    }
}