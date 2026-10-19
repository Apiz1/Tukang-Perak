<?php

namespace App\Policies;

use App\Models\GalleryPhoto;
use App\Models\User;

class GalleryPhotoPolicy
{
    public function delete(User $user, GalleryPhoto $galleryPhoto): bool
    {
        return $user->role === 'provider'
            && $user->providerProfile?->id === $galleryPhoto->provider_profile_id;
    }
}