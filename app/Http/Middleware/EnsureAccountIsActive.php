<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->status === 'suspended') {
            Auth::logout();

            return redirect()->route('login')->withErrors([
                'email' => 'Your account has been suspended. Contact support for details.',
            ]);
        }

        return $next($request);
    }
}