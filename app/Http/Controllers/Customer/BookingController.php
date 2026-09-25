<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function create(Service $service): Response
    {
        abort_unless($service->is_active, 404);
        abort_unless($service->providerProfile->status === 'approved', 404);

        return Inertia::render('Customer/Bookings/Create', [
            'service' => $service->load('providerProfile.user'),
        ]);
    }

    public function store(Request $request, Service $service): RedirectResponse
    {
        abort_unless($service->is_active, 404);
        abort_unless($service->providerProfile->status === 'approved', 404);

        $request->validate([
            'preferred_date' => 'required|date|after_or_equal:today',
            'district' => 'required|string|max:255',
            'address' => 'required|string|max:1000',
            'notes' => 'nullable|string|max:2000',
        ]);

        $booking = Booking::create([
            'customer_id' => auth()->id(),
            'provider_profile_id' => $service->provider_profile_id,
            'service_id' => $service->id,
            'preferred_date' => $request->preferred_date,
            'district' => $request->district,
            'address' => $request->address,
            'notes' => $request->notes,
            'price' => $service->base_price,
            'status' => 'requested',
        ]);

        return redirect()->route('customer.bookings.show', $booking)
            ->with('success', 'Booking request sent!');
    }

    public function index(): Response
    {
        return Inertia::render('Customer/Bookings/Index', [
            'bookings' => auth()->user()->bookings()
                ->with(['service', 'providerProfile'])
                ->latest()
                ->get(),
        ]);
    }

    public function show(Booking $booking): Response
    {
        abort_unless($booking->customer_id === auth()->id(), 403);

        return Inertia::render('Customer/Bookings/Show', [
            'booking' => $booking->load(['service', 'providerProfile.user']),
        ]);
    }

    public function cancel(Booking $booking): RedirectResponse
    {
        abort_unless($booking->customer_id === auth()->id(), 403);
        abort_unless($booking->status === 'requested', 403);

        $booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Booking cancelled.');
    }
}