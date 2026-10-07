<?php

namespace App\Policies;

use App\Models\ProviderProfile;
use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function create(User $user, ProviderProfile $providerProfile): bool
    {
        return $user->role === 'customer'
            && $providerProfile->user_id !== $user->id
            && ! Report::where('reporter_id', $user->id)
                ->where('provider_id', $providerProfile->user_id)
                ->where('status', 'pending')
                ->exists();
    }

    public function review(User $user): bool
    {
        return $user->role === 'admin';
    }
}