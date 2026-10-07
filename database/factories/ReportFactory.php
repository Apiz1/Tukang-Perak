<?php

namespace Database\Factories;

use App\Models\ProviderProfile;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reporter_id' => User::factory(),
            'provider_id' => ProviderProfile::factory()->create()->user_id,
            'reason'      => fake()->randomElement(Report::REASONS),
            'details'     => fake()->sentence(),
            'status'      => 'pending',
        ];
    }
}