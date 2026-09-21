<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@tukangperak.test',
            'phone_number' => '0123456789',
            'role' => 'admin',
            'password' => bcrypt('password'),
        ]);
    }
}