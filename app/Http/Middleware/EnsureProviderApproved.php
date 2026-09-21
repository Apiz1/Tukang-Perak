<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProviderApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $profile = $request->user()->providerProfile;

        if (! $profile || $profile->status !== 'approved') {
            abort(403, 'Your provider account is not yet approved.');
        }

        return $next($request);
    }
}