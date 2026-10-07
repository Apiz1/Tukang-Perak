<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ProviderProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SavedProviderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customer/SavedProviders/Index', [
            'savedProviders' => auth()->user()->savedProviders()
                ->with('user')
                ->withCount('bookings') // if you want to show activity, optional
                ->get(),
        ]);
    }

    public function store(ProviderProfile $providerProfile): RedirectResponse
    {
        auth()->user()->savedProviders()->syncWithoutDetaching([$providerProfile->id]);

        return back()->with('success', 'Tukang disimpan.');
    }

    public function destroy(ProviderProfile $providerProfile): RedirectResponse
    {
        auth()->user()->savedProviders()->detach($providerProfile->id);

        return back()->with('success', 'Tukang dibuang dari senarai simpanan.');
    }
}