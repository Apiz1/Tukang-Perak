<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $profile = auth()->user()->providerProfile;
        $bookings = $profile?->bookings();

        return Inertia::render('Provider/Dashboard', [
            'providerProfile' => $profile,
            'stats' => [
                'totalBookings' => $bookings ? (clone $bookings)->count() : 0,
                'pendingQuotes' => $bookings ? (clone $bookings)->where('status', 'requested')->count() : 0,
                'completedJobs' => $bookings ? (clone $bookings)->where('status', 'completed')->count() : 0,
                'averageRating' => null, // no reviews table yet
            ],
            'recentBookings' => $profile
                ? $profile->bookings()->with(['service', 'customer'])->latest()->take(5)->get()
                : [],
        ]);
    }
}