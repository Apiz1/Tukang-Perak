<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\BillplzService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BillplzCallbackController extends Controller
{
    public function __invoke(Request $request, BillplzService $billplz)
    {
        $data = $request->post();

        if (! $billplz->verifySignature($data)) {
            Log::warning('Billplz callback: invalid signature', ['bill' => $data['id'] ?? null]);

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
                $payment->markAsHeld($data['paid_at'] ?? null);
            } else {
                Log::error('Billplz callback: amount mismatch', ['payment' => $payment->id]);
            }
        }

        return response('OK');
    }
}