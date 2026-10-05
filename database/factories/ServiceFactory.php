<?php

namespace Database\Factories;

use App\Models\ProviderProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'provider_profile_id' => ProviderProfile::factory(),
            'title' => fake()->randomElement(['Servis Aircond', 'Pembaikan Paip', 'Wiring Elektrik']),
            'description' => fake()->sentence(),
            'base_price' => fake()->randomFloat(2, 30, 200),
            'price_type' => 'fixed',
            'is_active' => true,
        ];
    }

    public function hourly(): static
    {
        return $this->state(fn (array $attributes) => ['price_type' => 'hourly']);
    }
}