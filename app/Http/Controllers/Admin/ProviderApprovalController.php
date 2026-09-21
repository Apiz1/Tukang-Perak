<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProviderProfile;
use Illuminate\Http\RedirectResponse;
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
}