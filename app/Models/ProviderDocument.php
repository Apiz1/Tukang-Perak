<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['provider_profile_id', 'type', 'file_path', 'original_name'])]
class ProviderDocument extends Model
{
    public function providerProfile(): BelongsTo
    {
        return $this->belongsTo(ProviderProfile::class);
    }
}