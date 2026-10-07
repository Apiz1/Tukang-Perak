<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'booking_id', 'reporter_id', 'provider_id', 'reason', 'details',
    'status', 'admin_note', 'resolved_by', 'resolved_at',
])]
    class Report extends Model
    {
        use HasFactory;

        public const REASONS = ['harassment', 'no_show', 'scam', 'inappropriate', 'other'];

        protected function casts(): array
        {
            return ['resolved_at' => 'datetime'];
        }

        public function reporter(): BelongsTo
        {
            return $this->belongsTo(User::class, 'reporter_id');
        }

        public function provider(): BelongsTo
        {
            return $this->belongsTo(User::class, 'provider_id');
        }

        public function resolver(): BelongsTo
        {
            return $this->belongsTo(User::class, 'resolved_by');
        }
    }