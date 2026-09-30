<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Provider/Bookings/Index', [
            'bookings' => auth()->user()->providerProfile->bookings()
                ->with(['service', 'customer', 'payment'])
                ->latest()
                ->get(),
        ]);
    }

    public function accept(Booking $booking): RedirectResponse
    {
        $this->authorizeOwnership($booking);
        abort_unless($booking->status === 'requested', 403);

        $booking->update(['status' => 'accepted']);

        return back()->with('success', 'Booking accepted.');
    }

    public function decline(Booking $booking): RedirectResponse
    {
        $this->authorizeOwnership($booking);
        abort_unless($booking->status === 'requested', 403);

        $booking->update(['status' => 'declined']);

        return back()->with('success', 'Booking declined.');
    }

    public function markWorkDone(Booking $booking): RedirectResponse
    {
        $this->authorizeOwnership($booking);
        abort_unless($booking->status === 'accepted', 403);
        abort_unless($booking->payment?->status === 'held', 403, 'The customer has not paid yet.');

        $booking->update(['status' => 'work_done']);

        return back()->with('success', 'Marked as done. Waiting for customer confirmation.');
    }

    private function authorizeOwnership(Booking $booking): void
    {
        if ($booking->provider_profile_id !== auth()->user()->providerProfile->id) {
            abort(403);
        }
    }

    public function show(Booking $booking): Response
    {
        $this->authorizeOwnership($booking);

        return Inertia::render('Provider/Bookings/Show', [
            'booking' => $booking->load(['service', 'customer', 'payment', 'review', 'messages.sender']),
        ]);
    }
}