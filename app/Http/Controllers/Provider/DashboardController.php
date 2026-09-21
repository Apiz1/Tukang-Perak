<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Provider/Dashboard', [
            'providerProfile' => auth()->user()->providerProfile,
            'stats' => [], // wire real numbers once bookings table exists
            'recentBookings' => [],
        ]);
    }
}