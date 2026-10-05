<?php

namespace Database\Factories;

use App\Models\ProviderProfile;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'customer_id' => User::factory(),
            'provider_profile_id' => ProviderProfile::factory(),
            'service_id' => Service::factory(),
            'preferred_date' => fake()->dateTimeBetween('now', '+1 month'),
            'district' => fake()->randomElement(['parit_buntar', 'taiping', 'ipoh']),
            'address' => fake()->address(),
            'notes' => fake()->optional()->sentence(),
            'price' => fake()->randomFloat(2, 30, 200),
            'status' => 'requested',
        ];
    }
}