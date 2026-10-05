<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProviderProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->provider(),
            'category' => fake()->randomElement(['aircond', 'plumbing', 'electrical']),
            'district' => fake()->randomElement(['parit_buntar', 'taiping', 'ipoh']),
            'status' => 'approved',
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => 'pending']);
    }
}