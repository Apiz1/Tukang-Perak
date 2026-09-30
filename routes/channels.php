<?php

use App\Models\Booking;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('booking.{bookingId}', function ($user, $bookingId) {
    $booking = Booking::find($bookingId);

    if (! $booking) {
        return false;
    }

    return $booking->customer_id === $user->id
        || $booking->providerProfile->user_id === $user->id;
});