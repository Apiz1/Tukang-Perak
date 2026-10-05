<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool
    {
        if ($user->role === 'customer') {
            return $booking->customer_id === $user->id;
        }

        if ($user->role === 'provider') {
            return $booking->provider_profile_id === $user->providerProfile?->id;
        }

        return $user->role === 'admin';
    }

    public function accept(User $user, Booking $booking): bool
    {
        return $user->role === 'provider'
            && $booking->provider_profile_id === $user->providerProfile?->id
            && $booking->status === 'requested';
    }

    public function decline(User $user, Booking $booking): bool
    {
        return $this->accept($user, $booking); // same conditions
    }

    public function markWorkDone(User $user, Booking $booking): bool
    {
        return $user->role === 'provider'
            && $booking->provider_profile_id === $user->providerProfile?->id
            && $booking->status === 'accepted';
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->role === 'customer'
            && $booking->customer_id === $user->id
            && $booking->status === 'requested';
    }

    public function confirm(User $user, Booking $booking): bool
    {
        return $user->role === 'customer'
            && $booking->customer_id === $user->id
            && $booking->status === 'work_done'
            && $booking->payment?->status === 'held';
    }

    public function dispute(User $user, Booking $booking): bool
    {
        return $this->confirm($user, $booking); // same gate conditions
    }

    public function pay(User $user, Booking $booking): bool
    {
        if ($user->role !== 'customer' || $booking->customer_id !== $user->id) {
            return false;
        }

        if ($booking->service->price_type === 'hourly') {
            return $booking->status === 'work_done' && $booking->hours_worked !== null;
        }

        return $booking->status === 'accepted';
    }
}