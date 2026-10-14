<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'uploadedDocuments' => $profile->documents()->pluck('original_name', 'type'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = auth()->user()->providerProfile;

        if ($profile->status !== 'rejected') {
            return redirect()->route('provider.dashboard');
        }

        $hasIdentity = $profile->documents()->where('type', 'identity')->exists();

        $request->validate([
            'category' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'identity_document' => [Rule::requiredIf(! $hasIdentity), 'nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'ssm_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'certificate_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $profile->update([
            'category' => $request->category,
            'district' => $request->district,
            'status' => 'pending',
            'rejection_reason' => null,
        ]);

        foreach (['identity', 'ssm', 'certificate'] as $type) {
            if ($request->hasFile("{$type}_document")) {
                $profile->storeDocument($type, $request->file("{$type}_document"));
            }
        }

        $admins = \App\Models\User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\AdminAlertNotification(
            "Tukang ({$profile->user->name}) menghantar semula permohonan",
            route('admin.providers.show', $profile)
        ));

        return redirect()->route('provider.dashboard');
    }
}