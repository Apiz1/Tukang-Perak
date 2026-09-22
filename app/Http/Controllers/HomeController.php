<?php

namespace App\Http\Controllers;

use App\Models\ProviderProfile;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [
            'categories' => [
                ['value' => 'aircon', 'label' => 'Aircon Repair & Servicing'],
                ['value' => 'plumbing', 'label' => 'Plumbing'],
                ['value' => 'cleaning', 'label' => 'House Cleaning'],
                ['value' => 'electrical', 'label' => 'Electrical'],
            ],
            'featuredProviders' => ProviderProfile::where('status', 'approved')
                ->with(['user', 'services' => fn ($q) => $q->where('is_active', true)])
                ->latest()
                ->take(6)
                ->get(),
        ]);
    }
}