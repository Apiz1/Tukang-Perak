<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\ProviderProfile;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pendingProviders' => ProviderProfile::where('status', 'pending')->count(),
                'totalProviders' => ProviderProfile::where('status', 'approved')->count(),
                'totalCustomers' => User::where('role', 'customer')->count(),
                'totalBookings' => Booking::count(),
                'platformRevenue' => Payment::where('status', 'released')->sum('platform_fee'),
                'totalGmv' => Payment::where('status', 'released')->sum('amount'),
                'heldInEscrow' => Payment::where('status', 'held')->sum('amount'),
            ],
            'recentActivity' => $this->recentActivity(),
        ]);
    }

    private function recentActivity(): array
    {
        return ActivityLog::with('user:id,name')
            // plain logins and logouts would flood the feed; failed logins still show
            ->whereNotIn('action', ['auth.login', 'auth.logout'])
            ->latest('id')
            ->take(10)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'id' => $log->id,
                'icon' => $this->iconFor($log->action),
                'title' => $log->description,
                'description' => $log->user ? 'Oleh '.$log->user->name : 'Sistem / Tetamu',
                'time' => $log->created_at->diffForHumans(),
            ])
            ->all();
    }

    private function iconFor(string $action): string
    {
        if ($action === 'auth.login_failed') {
            return '⚠️';
        }

        return match (explode('.', $action)[0]) {
            'auth' => '🔑',
            'user' => '👤',
            'provider' => '🛠️',
            'customer' => '🙋',
            'booking' => '📅',
            'payment' => '💳',
            'report' => '🚩',
            'security' => '🚨',
            default => '•',
        };
    }
}