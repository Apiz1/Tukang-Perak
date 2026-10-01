<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $booking->notifyStatusChange('Diterima oleh tukang', onlyRole: 'customer');

        return back()->with('success', 'Booking accepted.');
    }

    public function decline(Booking $booking): RedirectResponse
    {
        $this->authorizeOwnership($booking);
        abort_unless($booking->status === 'requested', 403);

        $booking->update(['status' => 'declined']);
        $booking->notifyStatusChange('Ditolak oleh tukang', onlyRole: 'customer');

        return back()->with('success', 'Booking declined.');
    }

    public function markWorkDone(Request $request, Booking $booking): RedirectResponse
    {
        $this->authorizeOwnership($booking);
        abort_unless($booking->status === 'accepted', 403);

        if ($booking->service->price_type === 'hourly') {
            $request->validate([
                'hours_worked' => 'required|numeric|min:0.25|max:999',
            ]);

            $booking->update([
                'hours_worked' => $request->hours_worked,
                'status' => 'work_done',
            ]);
        } else {
            abort_unless($booking->payment?->status === 'held', 403, 'The customer has not paid yet.');

            $booking->update(['status' => 'work_done']);
        }
        
        $booking->notifyStatusChange('Kerja telah siap — sila sahkan', onlyRole: 'customer');

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