<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProviderDocument;
use App\Models\ProviderProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ActivityLog;

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
        if (! $providerProfile->documents()->where('type', 'identity')->exists()) {
            return back()->with('error', 'Tukang ini belum memuat naik dokumen pengenalan.');
        }

        $providerProfile->update(['status' => 'approved', 'rejection_reason' => null]);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Profil anda telah diluluskan'));

        ActivityLog::record('provider.approved', "Admin meluluskan tukang {$providerProfile->user->name}", $providerProfile);

        return back();
    }

    public function reject(Request $request, ProviderProfile $providerProfile): RedirectResponse
    {
        $request->validate(['rejection_reason' => 'required|string|max:1000']);

        $providerProfile->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Profil anda telah ditolak'));

        ActivityLog::record('provider.rejected', "Admin menolak tukang {$providerProfile->user->name}", $providerProfile, [
            'reason' => $request->rejection_reason,
        ]);

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

        ActivityLog::record('provider.suspended', "Admin menggantung tukang {$providerProfile->user->name}", $providerProfile, [
            'reason' => $request->suspension_reason,
        ]);

        return back();
    }

    public function unsuspend(ProviderProfile $providerProfile): RedirectResponse
    {
        $providerProfile->update(['status' => 'approved', 'suspension_reason' => null]);
        $providerProfile->user->notify(new \App\Notifications\ProviderStatusNotification($providerProfile, 'Akaun anda telah diaktifkan semula'));

        ActivityLog::record('provider.unsuspended', "Admin mengaktifkan semula tukang {$providerProfile->user->name}", $providerProfile);
        
        return back();
    }

    public function show(ProviderProfile $providerProfile): Response
    {
        return Inertia::render('Admin/Providers/Show', [
            'provider' => $providerProfile->load(['user', 'documents','galleryPhotos']),
        ]);
    }

    public function document(ProviderProfile $providerProfile, ProviderDocument $document)
    {
        abort_unless($document->provider_profile_id === $providerProfile->id, 404);
        abort_unless(Storage::disk('local')->exists($document->file_path), 404);

        ActivityLog::record(
            'provider.document_viewed',
            "Admin membuka dokumen {$document->type} milik {$providerProfile->user->name}",
            $providerProfile,
            ['document_type' => $document->type],
        );

       return Storage::disk('local')->response($document->file_path, $document->original_name, [
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }
}