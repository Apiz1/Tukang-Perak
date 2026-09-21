<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Provider/Profile/Edit', [
            'providerProfile' => auth()->user()->providerProfile,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'photo' => 'nullable|image|max:2048', // 2MB max
        ]);

        $profile = auth()->user()->providerProfile;

        $data = [
            'business_name' => $request->business_name,
            'description' => $request->description,
        ];

        if ($request->hasFile('photo')) {
            if ($profile->photo_path) {
                Storage::disk('public')->delete($profile->photo_path);
            }

            $data['photo_path'] = $request->file('photo')->store('provider-photos', 'public');
        }

        $profile->update($data);

        return back()->with('success', 'Profile updated.');
    }
}