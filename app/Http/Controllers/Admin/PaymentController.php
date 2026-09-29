<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Payments/Index', [
            'payments' => Payment::with(['booking.customer', 'booking.providerProfile', 'booking.service'])
                ->when($request->status, fn ($q, $status) => $q->where('status', $status))
                ->latest()
                ->paginate(15)
                ->withQueryString(),
            'filters' => $request->only(['status']),
        ]);
    }

    public function release(Request $request, Payment $payment): RedirectResponse
    {
        abort_unless($payment->status === 'disputed', 403);

        $request->validate(['admin_note' => 'nullable|string|max:1000']);

        $payment->update(['admin_note' => $request->admin_note]);
        $payment->markAsReleased();
        $payment->booking->update(['status' => 'completed']);

        return back()->with('success', 'Payment released to provider.');
    }

    public function refund(Request $request, Payment $payment): RedirectResponse
    {
        abort_unless($payment->status === 'disputed', 403);

        $request->validate(['admin_note' => 'required|string|max:1000']);

        $payment->update([
            'status' => 'refunded',
            'admin_note' => $request->admin_note,
        ]);
        $payment->booking->update(['status' => 'cancelled']);

        return back()->with('success', 'Payment marked as refunded.');
    }
}