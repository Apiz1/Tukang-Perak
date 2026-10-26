<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

#[Fillable(['booking_id', 'amount', 'platform_fee', 'provider_amount', 'status', 'dispute_reason', 'admin_note', 'billplz_bill_id', 'billplz_url', 'paid_at', 'released_at'])]
class Payment extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'platform_fee' => 'decimal:2',
            'provider_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'released_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Idempotent: callback and redirect may both arrive, in any order.
     */
    // app/Models/Payment.php
    public function markAsHeld(?string $paidAt = null): bool
    {
        $transitioned = false;

        DB::transaction(function () use ($paidAt, &$transitioned) {
            $payment = static::whereKey($this->id)->lockForUpdate()->first();

            if ($payment->status !== 'pending') {
                return;
            }

            $payment->update([
                'status' => 'held',
                'paid_at' => $paidAt ? Carbon::parse($paidAt) : now(),
            ]);

            $transitioned = true;
        });

        if ($transitioned) {
            ActivityLog::record(
                'payment.held',
                "Bayaran #{$this->id} diterima dan ditahan (escrow)",
                $this,
                ['amount' => (string) $this->amount],
            );
        }

        return $transitioned;
    }

    public function markAsReleased(array $context = []): void
    {
        $this->update([
            'status' => 'released',
            'released_at' => now(),
        ]);

        ActivityLog::record(
            'payment.released',
            "Bayaran #{$this->id} dilepaskan kepada tukang",
            $this,
            ['amount' => (string) $this->amount, 'provider_amount' => (string) $this->provider_amount] + $context,
        );
    }

    public function markAsDisputed(string $reason): void
    {
        $this->update([
            'status' => 'disputed',
            'dispute_reason' => $reason,
        ]);

        ActivityLog::record(
            'payment.disputed',
            "Pertikaian dibuka untuk bayaran #{$this->id}",
            $this,
            ['reason' => $reason],
        );
    }
}