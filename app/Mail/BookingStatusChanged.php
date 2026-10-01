<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingStatusChanged extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public string $statusLabel,
        public string $recipientRole, // 'customer' or 'provider'
        public ?string $extraNote = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Tukang Perak — Booking #{$this->booking->id}: {$this->statusLabel}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking-status-changed',
        );
    }
}