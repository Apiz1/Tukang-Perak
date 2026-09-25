<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $bookings = Booking::with(['customer', 'providerProfile', 'service'])
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status']),
        ]);
    }

    public function show(Booking $booking): Response
    {
        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking->load(['customer', 'providerProfile.user', 'service']),
        ]);
    }
}