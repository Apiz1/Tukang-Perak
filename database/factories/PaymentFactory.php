<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 30, 200);
        $fee = round($amount * 0.1, 2);

        return [
            'booking_id' => Booking::factory(),
            'amount' => $amount,
            'platform_fee' => $fee,
            'provider_amount' => $amount - $fee,
            'status' => 'pending',
            'billplz_bill_id' => fake()->uuid(),
            'billplz_url' => fake()->url(),
        ];
    }

    public function held(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'held',
            'paid_at' => now(),
        ]);
    }

    public function released(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'released',
            'paid_at' => now()->subHour(),
            'released_at' => now(),
        ]);
    }
}