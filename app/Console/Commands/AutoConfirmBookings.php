<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;

class AutoConfirmBookings extends Command
{
    protected $signature = 'bookings:auto-confirm';
    protected $description = 'Auto-confirm bookings stuck in work_done for over 48 hours';

    public function handle(): void
    {
        $bookings = Booking::where('status', 'work_done')
            ->where('updated_at', '<=', now()->subHours(48))
            ->whereHas('payment', fn ($q) => $q->where('status', 'held'))
            ->get();

        foreach ($bookings as $booking) {
            $booking->update(['status' => 'completed']);
            $booking->payment->markAsReleased();

            $booking->notifyStatusChange(
                'Tempahan disahkan secara automatik',
                extraNote: 'Tiada respons dalam 48 jam, jadi tempahan ini disahkan siap secara automatik dan bayaran telah dilepaskan.'
            );

            $this->info("Auto-confirmed booking #{$booking->id}");
        }

        $this->info("Done. {$bookings->count()} booking(s) processed.");
    }
}