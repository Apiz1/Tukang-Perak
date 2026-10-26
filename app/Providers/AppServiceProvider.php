<?php

namespace App\Providers;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Login::class, fn (Login $e) => ActivityLog::record(
            'auth.login',
            "{$e->user->name} log masuk",
            $e->user,
            userId: $e->user->id,
        ));

        Event::listen(Logout::class, function (Logout $e) {
            if ($e->user) {
                ActivityLog::record('auth.logout', "{$e->user->name} log keluar", $e->user, userId: $e->user->id);
            }
        });

        Event::listen(Failed::class, fn (Failed $e) => ActivityLog::record(
            'auth.login_failed',
            'Percubaan log masuk gagal',
            $e->user,
            ['email' => $e->credentials['email'] ?? null],
            userId: $e->user?->id,
        ));
        Vite::prefetch(concurrency: 3);
    }
}
