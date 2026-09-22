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

        return back();
    }

    public function reject(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update(['status' => 'rejected']);

        return back();
    }

    public function suspend(Request $request, ProviderProfile $providerProfile): RedirectResponse
    {
        $request->validate([
            'suspension_reason' => 'required|string|max:1000',
        ]);

        $providerProfile->update([
            'status' => 'suspended',
            'suspension_reason' => $request->suspension_reason,
        ]);

        return back();
    }

    public function unsuspend(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update([
            'status' => 'approved',
            'suspension_reason' => null,
        ]);

        return back();
    }

    public function show(ProviderProfile $providerProfile): Response
    {
        return Inertia::render('Admin/Providers/Show', [
            'provider' => $providerProfile->load('user'),
        ]);
    }
}