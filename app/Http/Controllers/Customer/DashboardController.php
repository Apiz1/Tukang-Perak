<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $bookings = auth()->user()->bookings();

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'totalBookings' => (clone $bookings)->count(),
                'activeBookings' => (clone $bookings)->whereIn('status', ['requested', 'accepted'])->count(),
                'completedBookings' => (clone $bookings)->where('status', 'completed')->count(),
            ],
            'recentBookings' => auth()->user()->bookings()
                ->with(['service', 'providerProfile'])
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}