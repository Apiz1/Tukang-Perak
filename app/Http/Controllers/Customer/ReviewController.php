<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Booking $booking): RedirectResponse
    {
        abort_unless($booking->customer_id === auth()->id(), 403);
        abort_unless($booking->status === 'completed', 403);
        abort_if($booking->review()->exists(), 403, 'You already reviewed this booking.');

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $booking->review()->create([
            'customer_id' => auth()->id(),
            'provider_profile_id' => $booking->provider_profile_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Thanks for your review!');
    }
}