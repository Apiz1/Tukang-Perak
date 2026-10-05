<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public string $statusLabel,
        public string $recipientRole,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'booking_status',
            'booking_id' => $this->booking->id,
            'status_label' => $this->statusLabel,
            'service_title' => $this->booking->service->title,
            'url' => route(
                $this->recipientRole === 'customer' ? 'customer.bookings.show' : 'provider.bookings.show',
                $this->booking
            ),
        ];
    }
}