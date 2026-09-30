<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, Booking $booking): JsonResponse|RedirectResponse
    {
        $this->authorizeParticipant($booking);
        abort_unless(in_array($booking->status, ['accepted', 'work_done', 'completed']), 403);

        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $message = $booking->messages()->create([
            'sender_id' => auth()->id(),
            'body' => $request->body,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        if ($request->wantsJson()) {
            return response()->json(['message' => $message->load('sender:id,name')]);
        }

        return back();
    }

    private function authorizeParticipant(Booking $booking): void
    {
        $isCustomer = $booking->customer_id === auth()->id();
        $isProvider = $booking->providerProfile->user_id === auth()->id();

        abort_unless($isCustomer || $isProvider, 403);
    }
}