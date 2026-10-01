<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['customer_id', 'provider_profile_id', 'service_id', 'preferred_date', 'district', 'address', 'notes', 'price', 'hours_worked', 'status'])]
class Booking extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'preferred_date' => 'date',
            'price' => 'decimal:2',
            'hours_worked' => 'decimal:2',
        ];
    }

    public function finalAmount(): float
    {
        if ($this->service->price_type === 'hourly') {
            return round(((float) $this->price) * ((float) $this->hours_worked), 2);
        }

        return (float) $this->price;
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function providerProfile(): BelongsTo
    {
        return $this->belongsTo(ProviderProfile::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function messages(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at');
    }
}