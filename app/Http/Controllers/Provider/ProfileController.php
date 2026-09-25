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
            'category' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        $profile = auth()->user()->providerProfile;

        $categoryChanged = $profile->category !== $request->category;
        $districtChanged = $profile->district !== $request->district;

        $data = [
            'business_name' => $request->business_name,
            'description' => $request->description,
            'category' => $request->category,
            'district' => $request->district,
        ];

        if ($categoryChanged || $districtChanged) {
            $data['status'] = 'pending';
        }

        if ($request->hasFile('photo')) {
            if ($profile->photo_path) {
                Storage::disk('public')->delete($profile->photo_path);
            }

            $data['photo_path'] = $request->file('photo')->store('provider-photos', 'public');
        }

        $profile->update($data);

        $message = ($categoryChanged || $districtChanged)
            ? 'Profile updated. Since you changed your category or district, your account is pending re-approval.'
            : 'Profile updated.';

        return redirect()->route('provider.dashboard')->with('success', $message);
    }
}