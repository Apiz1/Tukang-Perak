<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

#[Fillable(['user_id', 'business_name', 'category', 'district', 'description', 'photo_path', 'cover_path', 'status', 'suspension_reason'])]
class ProviderProfile extends Model
{
    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }

    public function bookings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function savedByCustomers(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_providers', 'provider_profile_id', 'customer_id')
            ->withTimestamps();
    }

    public function documents(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProviderDocument::class);
    }

    public function storeDocument(string $type, UploadedFile $file): ProviderDocument
    {
        $existing = $this->documents()->where('type', $type)->first();

        if ($existing) {
            Storage::disk('local')->delete($existing->file_path);
        }

        return $this->documents()->updateOrCreate(
            ['type' => $type],
            [
                'file_path' => $file->store("provider-documents/{$this->id}", 'local'),
                'original_name' => $file->getClientOriginalName(),
            ]
        );
    }
}