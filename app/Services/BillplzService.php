<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class BillplzService
{
    private function baseUrl(): string
    {
        return config('services.billplz.sandbox')
            ? 'https://www.billplz-sandbox.com/api/v3'
            : 'https://www.billplz.com/api/v3';
    }

    public function createBill(Payment $payment, Booking $booking): array
    {
        $callbackUrl = config('services.billplz.callback_url') ?: route('billplz.callback');

        $response = Http::withBasicAuth(config('services.billplz.key'), '')
            ->asForm()
            ->timeout(15)
            ->post($this->baseUrl().'/bills', [
                'collection_id' => config('services.billplz.collection_id'),
                'email' => $booking->customer->email,
                'name' => $booking->customer->name,
                'amount' => (int) round(((float) $payment->amount) * 100), // sen
                'callback_url' => $callbackUrl,
                'redirect_url' => route('customer.payments.return'),
                'description' => Str::limit("Booking #{$booking->id} - {$booking->service->title}", 200, ''),
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Billplz error '.$response->status().': '.$response->body());
        }

        return $response->json();
    }

    /**
     * X Signature check per Billplz docs: drop x_signature, build "key+value" strings,
     * sort case-insensitively, join with "|", HMAC-SHA256 with your X Signature key.
     * For redirects, pass the nested billplz[...] array with prefix 'billplz'.
     */
    public function verifySignature(array $params, string $prefix = ''): bool
    {
        $key = config('services.billplz.x_signature_key');
        $received = $params['x_signature'] ?? null;

        if (! $key || ! $received) {
            return false;
        }

        unset($params['x_signature']);

        $pairs = $this->flatten($params, $prefix);
        usort($pairs, 'strcasecmp');

        $expected = hash_hmac('sha256', implode('|', $pairs), $key);

        return hash_equals($expected, (string) $received);
    }

    private function flatten(array $params, string $prefix = ''): array
    {
        $pairs = [];

        foreach ($params as $key => $value) {
            if (is_array($value)) {
                $pairs = array_merge($pairs, $this->flatten($value, $prefix.$key));
            } else {
                $pairs[] = $prefix.$key.(string) $value;
            }
        }

        return $pairs;
    }
}