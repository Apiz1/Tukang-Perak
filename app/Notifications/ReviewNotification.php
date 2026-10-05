<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ReviewNotification extends Notification
{
    use Queueable;

    public function __construct(public Review $review) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_review',
            'rating' => $this->review->rating,
            'booking_id' => $this->review->booking_id,
            'url' => route('provider.reviews.index'),
        ];
    }
}