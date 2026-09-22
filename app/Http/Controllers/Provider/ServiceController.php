<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Provider/Services/Index', [
            'services' => auth()->user()->providerProfile->services()->latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Provider/Services/Create');
    }

   public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price_type' => 'required|in:fixed,hourly',
            'base_price' => 'required|numeric|min:0',
        ]);

        auth()->user()->providerProfile->services()->create($request->only([
            'title', 'description', 'price_type', 'base_price',
        ]));

        return redirect()->route('provider.services.index');
    }

    public function edit(Service $service): Response
    {
        $this->authorizeOwnership($service);

        return Inertia::render('Provider/Services/Edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $this->authorizeOwnership($service);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price_type' => 'required|in:fixed,hourly',
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $service->update($request->only([
            'title', 'description', 'price_type', 'base_price', 'is_active',
        ]));

        return redirect()->route('provider.services.index');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $this->authorizeOwnership($service);

        $service->delete();

        return back();
    }

    private function authorizeOwnership(Service $service): void
    {
        if ($service->provider_profile_id !== auth()->user()->providerProfile->id) {
            abort(403);
        }
    }

    public function deactivate(Service $service): RedirectResponse
    {
        $this->authorizeOwnership($service);

        $service->update(['is_active' => false]);

        return back();
    }

    public function activate(Service $service): RedirectResponse
    {
        $this->authorizeOwnership($service);

        $service->update(['is_active' => true]);

        return back();
    }
}