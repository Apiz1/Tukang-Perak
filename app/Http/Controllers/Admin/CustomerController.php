<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Customers/Index', [
            'customers' => User::where('role', 'customer')
                ->withCount('bookings')
                ->latest()
                ->paginate(10),
        ]);
    }

    public function suspend(Request $request, User $user): RedirectResponse
    {
        abort_unless($user->role === 'customer', 404);

        $request->validate([
            'suspension_reason' => 'required|string|max:1000',
        ]);

        $user->update([
            'status' => 'suspended',
            'suspension_reason' => $request->suspension_reason,
        ]);

        ActivityLog::record('customer.suspended', "Admin menggantung pelanggan {$user->name}", $user, [
            'reason' => $request->suspension_reason,
        ]);

        return back();
    }

    public function unsuspend(User $user): RedirectResponse
    {
        abort_unless($user->role === 'customer', 404);
     
        $user->update([
            'status' => 'active',
            'suspension_reason' => null,
        ]);

        ActivityLog::record('customer.unsuspended', "Admin mengaktifkan semula pelanggan {$user->name}", $user);

        return back();
    }

    public function show(User $user): Response
    {
        abort_unless($user->role === 'customer', 404);

        return Inertia::render('Admin/Customers/Show', [
           'customer' => $user->loadCount('bookings')->load(['bookings.service', 'bookings.providerProfile.user']),
        ]);
    }
}