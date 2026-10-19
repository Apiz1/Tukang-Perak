<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        $profile = auth()->user()->providerProfile;

        return Inertia::render('Provider/Gallery/Index', [
            'photos' => $profile->galleryPhotos()->get(),
            'max' => GalleryPhoto::MAX_PER_PROVIDER,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $profile = auth()->user()->providerProfile;

        $remaining = GalleryPhoto::MAX_PER_PROVIDER - $profile->galleryPhotos()->count();

        $request->validate([
            'photos' => ['required', 'array', 'min:1', 'max:'.max($remaining, 0)],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ], [
            'photos.max' => "Anda hanya boleh tambah {$remaining} gambar lagi (maksimum ".GalleryPhoto::MAX_PER_PROVIDER.').',
        ]);

        foreach ($request->file('photos') as $file) {
            $profile->galleryPhotos()->create([
                'path' => $file->store('provider-gallery', 'public'),
            ]);
        }

        return back()->with('success', 'Gambar ditambah.');
    }

    public function destroy(GalleryPhoto $galleryPhoto): RedirectResponse
    {
        $this->authorize('delete', $galleryPhoto);

        Storage::disk('public')->delete($galleryPhoto->path);
        $galleryPhoto->delete();

        return back()->with('success', 'Gambar dipadam.');
    }
}