<?php

namespace App\Notifications;

use App\Models\ProviderProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProviderStatusNotification extends Notification
{
    use Queueable;

   public function __construct
   (
    public ProviderProfile $providerProfile,
    public string $statusLabel,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'provider_status',
            'status_label' => $this->statusLabel,
            'url' => route('provider.dashboard'),
        ];
    }
}