<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReapplyController extends Controller
{
    public function edit(): Response|RedirectResponse
    {
        $profile = auth()->user()->providerProfile;

        if ($profile->status !== 'rejected') {
            return redirect()->route('provider.dashboard');
        }

        return Inertia::render('Provider/Reapply', [
            'providerProfile' => $profile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = auth()->user()->providerProfile;

        if ($profile->status !== 'rejected') {
            return redirect()->route('provider.dashboard');
        }

        $request->validate([
            'category' => 'required|string|max:255',
            'district' => 'required|string|max:255',
        ]);

        $profile->update([
            'category' => $request->category,
            'district' => $request->district,
            'status' => 'pending',
        ]);

        return redirect()->route('provider.dashboard');
    }
}