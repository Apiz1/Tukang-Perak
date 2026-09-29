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

        $payments = $profile
            ? \App\Models\Payment::whereHas('booking', fn ($q) => $q->where('provider_profile_id', $profile->id))
            : null;

        return Inertia::render('Provider/Dashboard', [
            'providerProfile' => $profile,
            'stats' => [
                'totalBookings' => $bookings ? (clone $bookings)->count() : 0,
                'pendingQuotes' => $bookings ? (clone $bookings)->where('status', 'requested')->count() : 0,
                'completedJobs' => $bookings ? (clone $bookings)->where('status', 'completed')->count() : 0,
                'averageRating' => $profile ? $profile->reviews()->avg('rating') : null,
                'reviewCount' => $profile ? $profile->reviews()->count() : 0,
                'totalRevenue' => $payments ? (clone $payments)->where('status', 'released')->sum('provider_amount') : 0,
                'pendingRevenue' => $payments ? (clone $payments)->where('status', 'held')->sum('provider_amount') : 0,
            ],
            'recentBookings' => $profile
                ? $profile->bookings()->with(['service', 'customer'])->latest()->take(5)->get()
                : [],
        ]);
    }
}