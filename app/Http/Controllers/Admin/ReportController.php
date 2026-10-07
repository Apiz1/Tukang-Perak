<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $this->authorize('review', Report::class);

        return Inertia::render('Admin/Reports/Index', [
            'reports' => Report::with(['reporter:id,name', 'provider:id,name'])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function show(Report $report)
    {
        $this->authorize('review', Report::class);

        return Inertia::render('Admin/Reports/Show', [
            'report' => $report->load(['reporter:id,name', 'provider.providerProfile']),
            'providerReportCount' => Report::where('provider_id', $report->provider_id)->count(),
        ]);
    }

    public function update(Request $request, Report $report)
    {
        $this->authorize('review', Report::class);

        $data = $request->validate([
            'status'     => ['required', Rule::in(['dismissed', 'action_taken'])],
            'admin_note' => ['required', 'string', 'max:2000'],
        ]);

        $report->update($data + [
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return redirect()->route('admin.reports.index')
            ->with('success', 'Laporan dikemas kini.');
    }
}