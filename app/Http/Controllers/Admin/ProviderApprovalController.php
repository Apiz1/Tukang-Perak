<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProviderProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProviderApprovalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Providers/Index', [
            'providers' => ProviderProfile::with('user')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function approve(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update(['status' => 'approved']);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Profil anda telah diluluskan'));

        return back();
    }

    public function reject(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update(['status' => 'rejected']);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Profil anda telah ditolak'));

        return back();
    }

    public function suspend(Request $request, ProviderProfile $providerProfile): RedirectResponse
    {
        $request->validate(['suspension_reason' => 'required|string|max:1000']);

        $providerProfile->update([
            'status' => 'suspended',
            'suspension_reason' => $request->suspension_reason,
        ]);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Akaun anda telah digantung'));

        return back();
    }

    public function unsuspend(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update(['status' => 'approved', 'suspension_reason' => null]);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Akaun anda telah diaktifkan semula'));

        return back();
    }

    public function show(ProviderProfile $providerProfile): Response
    {
        return Inertia::render('Admin/Providers/Show', [
            'provider' => $providerProfile->load('user'),
        ]);
    }
}