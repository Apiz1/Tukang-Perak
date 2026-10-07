<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\ProviderProfile;
use App\Models\Report;
use App\Models\User;
use App\Notifications\AdminAlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function create(ProviderProfile $providerProfile)
    {
        $this->authorize('create', [Report::class, $providerProfile]);

        // remember the page the customer came from
        $previous = url()->previous();

        if ($previous !== url()->current() && str_starts_with($previous, url('/'))) {
            session(['report_return_to' => $previous]);
        }

        return Inertia::render('Customer/Reports/Create', [
            'provider' => $providerProfile->load('user'),
            'reasons'  => Report::REASONS,
        ]);
    }

    public function store(Request $request, ProviderProfile $providerProfile)
    {
        $this->authorize('create', [Report::class, $providerProfile]);

        $data = $request->validate([
            'reason'  => ['required', Rule::in(Report::REASONS)],
            'details' => ['nullable', 'string', 'max:2000'],
        ]);

        $report = Report::create($data + [
            'reporter_id' => $request->user()->id,
            'provider_id' => $providerProfile->user_id,
        ]);

        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new AdminAlertNotification(
            "Laporan baharu terhadap tukang {$providerProfile->user->name}",
            route('admin.reports.show', $report)
        ));

        return redirect(session()->pull('report_return_to', route('providers.show', $providerProfile)))
            ->with('success', 'Laporan dihantar.');
    }
}