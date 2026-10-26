<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public const CATEGORIES = [
        'auth', 'user', 'provider', 'customer', 'booking', 'payment', 'report', 'security',
    ];

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'category' => ['nullable', Rule::in(self::CATEGORIES)],
            'search'   => ['nullable', 'string', 'max:100'],
            'from'     => ['nullable', 'date'],
            'to'       => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        $logs = ActivityLog::with('user:id,name,role')
            ->when($filters['category'] ?? null, fn ($q, $category) => $q->where('action', 'like', $category.'.%'))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->whereLike('description', "%{$search}%"))
            ->when($filters['from'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($filters['to'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->latest('id')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['category', 'search', 'from', 'to']),
            'categories' => self::CATEGORIES,
        ]);
    }
}