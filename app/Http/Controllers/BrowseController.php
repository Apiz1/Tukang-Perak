<?php

namespace App\Http\Controllers;

use App\Models\ProviderProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrowseController extends Controller
{
    public function index(Request $request): Response
    {
        $providers = ProviderProfile::where('status', 'approved')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->with(['user', 'services' => fn ($q) => $q->where('is_active', true)])
            ->when($request->category, fn ($q, $category) => $q->where('category', $category))
            ->when($request->district, fn ($q, $district) => $q->where('district', $district))
            ->when($request->search, fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('business_name', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            }))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Browse', [
            'providers' => $providers,
            'filters' => $request->only(['category', 'district', 'search']),
        ]);
    }

    public function show(ProviderProfile $providerProfile): Response
    {
        abort_unless($providerProfile->status === 'approved', 404);

        return Inertia::render('Providers/Show', [
            'provider' => $providerProfile
                ->loadAvg('reviews', 'rating')
                ->loadCount('reviews')
                ->load([
                    'user',
                    'services' => fn ($q) => $q->where('is_active', true),
                    'reviews' => fn ($q) => $q->with('customer:id,name')->latest()->take(10),
                ]),
            'isSaved' => auth()->check() && auth()->user()->role === 'customer'
                ? auth()->user()->savedProviders()->where('provider_profile_id', $providerProfile->id)->exists()
                : false,
        ]);
    }
}