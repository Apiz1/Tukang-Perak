<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\BillplzService;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BillplzCallbackController extends Controller
{
    public function __invoke(Request $request, BillplzService $billplz)
    {
        $data = $request->post();

        if (! $billplz->verifySignature($data)) {
            Log::warning('Billplz callback: invalid signature', ['bill' => $data['id'] ?? null]);

            ActivityLog::record(
                'security.billplz_invalid_signature',
                'Callback Billplz dengan tandatangan tidak sah',
                null,
                ['bill_id' => $data['id'] ?? null],
            );

            return response('Invalid signature', 403);
        }

        $payment = Payment::where('billplz_bill_id', $data['id'] ?? null)->first();

        // Acknowledge unknown bills so Billplz doesn't keep retrying
        if (! $payment) {
            return response('OK');
        }

        $paid = ($data['paid'] ?? 'false') === 'true' && ($data['state'] ?? '') === 'paid';

        if ($paid) {
                $expected = (int) round(((float) $payment->amount) * 100);

                if ((int) ($data['paid_amount'] ?? 0) === $expected) {
                    if ($payment->markAsHeld($data['paid_at'] ?? null)) {
                        try {
                            $payment->booking->notifyPaymentReceived();
                        } catch (\Throwable $e) {
                            // Never fail the webhook over a notification problem
                            report($e);
                        }
                    }
                } else {
                    Log::error('Billplz callback: amount mismatch', ['payment' => $payment->id]);

                    ActivityLog::record(
                        'security.amount_mismatch',
                        "Jumlah bayaran tidak sepadan untuk pembayaran #{$payment->id}",
                        $payment,
                        ['expected' => $expected, 'received' => (int) ($data['paid_amount'] ?? 0)],
                    );
                }
            }

        return response('OK');
    }
}