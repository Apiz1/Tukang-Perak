<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Provider/Reviews/Index', [
            'reviews' => auth()->user()->providerProfile->reviews()
                ->with(['customer:id,name', 'booking.service:id,title'])
                ->latest()
                ->get(),
        ]);
    }

    public function reply(Request $request, Review $review): RedirectResponse
    {
        abort_unless($review->provider_profile_id === auth()->user()->providerProfile->id, 403);

        $request->validate([
            'provider_reply' => 'required|string|max:1000',
        ]);

        $review->update([
            'provider_reply' => $request->provider_reply,
            'replied_at' => now(),
        ]);

        return back()->with('success', 'Reply posted.');
    }
}