<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Services\BillplzService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function store(Booking $booking, BillplzService $billplz)
    {
        abort_unless($booking->customer_id === auth()->id(), 403);
        abort_unless($booking->status === 'accepted', 403);

        if ($booking->service->price_type === 'hourly') {
            return back()->with('error', 'Online payment for hourly services is not available yet.');
        }

        if ($booking->payments()->whereIn('status', ['held', 'released'])->exists()) {
            return back()->with('error', 'This booking is already paid.');
        }

        // Reuse an unpaid bill instead of creating duplicates
        $existing = $booking->payments()
            ->where('status', 'pending')
            ->whereNotNull('billplz_url')
            ->latest()
            ->first();

        if ($existing) {
            return Inertia::location($existing->billplz_url);
        }

        $fee = round(((float) $booking->price) * ((float) config('services.marketplace.platform_fee_percent')) / 100, 2);

        $payment = $booking->payments()->create([
            'amount' => $booking->price,
            'platform_fee' => $fee,
            'provider_amount' => ((float) $booking->price) - $fee,
        ]);

        try {
            $bill = $billplz->createBill($payment, $booking->load(['customer', 'service']));
        } catch (\Throwable $e) {
            report($e);
            $payment->delete();

            return back()->with('error', 'Could not start payment. Please try again.');
        }

        $payment->update([
            'billplz_bill_id' => $bill['id'],
            'billplz_url' => $bill['url'],
        ]);

        // Full-page redirect to Billplz (a normal redirect() wouldn't leave the Inertia app)
        return Inertia::location($bill['url']);
    }

    public function return(Request $request, BillplzService $billplz): RedirectResponse
    {
        $params = (array) $request->query('billplz', []);

        $payment = Payment::with('booking')
            ->where('billplz_bill_id', $params['id'] ?? null)
            ->first();

        abort_unless($payment && $payment->booking->customer_id === auth()->id(), 404);

        if ($billplz->verifySignature($params, 'billplz') && ($params['paid'] ?? '') === 'true') {
            $payment->markAsHeld($params['paid_at'] ?? null);

            return redirect()->route('customer.bookings.show', $payment->booking)
                ->with('success', 'Payment received. Thank you!');
        }

        return redirect()->route('customer.bookings.show', $payment->booking)
            ->with('error', 'Payment was not completed.');
    }
}