<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
   public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'providerProfile' => $request->user()->role === 'provider'
                        ? $request->user()->providerProfile
                        : null,
                ] : null,
            ],
            'notifications' => $request->user() ? [
                'unread_count' => $request->user()->unreadNotifications()->count(),
                'recent' => $request->user()->notifications()
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(fn ($n) => [
                        'id' => $n->id,
                        'data' => $n->data,
                        'read_at' => $n->read_at,
                        'created_at' => $n->created_at->diffForHumans(),
                    ]),
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'adminCounts' => fn () => $request->user()?->role === 'admin' ? [
                'payments'  => \App\Models\Payment::where('status', 'disputed')->count(),
                'reports'   => \App\Models\Report::where('status', 'pending')->count(),
                'providers' => \App\Models\ProviderProfile::where('status', 'pending')->count(),
            ] : null,
            'providerCounts' => fn () => ($request->user()?->role === 'provider' && $request->user()->providerProfile) ? [
                'bookings' => $request->user()->providerProfile->bookings()->where('status', 'requested')->count(),
                'reviews'  => $request->user()->providerProfile->reviews()->whereNull('replied_at')->count(),
            ] : null,
        ];
    }
}
