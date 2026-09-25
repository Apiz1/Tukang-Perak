<?php

use App\Http\Controllers\DashboardRedirectController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\BrowseController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/browse', [BrowseController::class, 'index'])->name('browse');
Route::get('/providers/{providerProfile}', [BrowseController::class, 'show'])->name('providers.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardRedirectController::class)->name('dashboard.redirect');
    Route::get('/services/{service}/book', [\App\Http\Controllers\Customer\BookingController::class, 'create'])->name('services.book');
    Route::post('/services/{service}/book', [\App\Http\Controllers\Customer\BookingController::class, 'store'])->name('services.book.store');

    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::get('/dashboard', \App\Http\Controllers\Customer\DashboardController::class)->name('dashboard');
        
        Route::get('/bookings', [\App\Http\Controllers\Customer\BookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/{booking}', [\App\Http\Controllers\Customer\BookingController::class, 'show'])->name('bookings.show');
        Route::patch('/bookings/{booking}/cancel', [\App\Http\Controllers\Customer\BookingController::class, 'cancel'])->name('bookings.cancel');
    });

   Route::middleware('role:provider')->prefix('provider')->name('provider.')->group(function () {
        Route::get('/dashboard', \App\Http\Controllers\Provider\DashboardController::class)->name('dashboard');
        Route::get('/reapply', [\App\Http\Controllers\Provider\ReapplyController::class, 'edit'])->name('reapply.edit');
        Route::patch('/reapply', [\App\Http\Controllers\Provider\ReapplyController::class, 'update'])->name('reapply.update');

        Route::middleware('provider.approved')->group(function () {
        Route::get('/profile', [\App\Http\Controllers\Provider\ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [\App\Http\Controllers\Provider\ProfileController::class, 'update'])->name('profile.update');
        
        Route::get('/services', [\App\Http\Controllers\Provider\ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/create', [\App\Http\Controllers\Provider\ServiceController::class, 'create'])->name('services.create');
        Route::post('/services', [\App\Http\Controllers\Provider\ServiceController::class, 'store'])->name('services.store');
        Route::get('/services/{service}/edit', [\App\Http\Controllers\Provider\ServiceController::class, 'edit'])->name('services.edit');
        Route::patch('/services/{service}', [\App\Http\Controllers\Provider\ServiceController::class, 'update'])->name('services.update');
        Route::delete('/services/{service}', [\App\Http\Controllers\Provider\ServiceController::class, 'destroy'])->name('services.destroy');
        Route::patch('/services/{service}/deactivate', [\App\Http\Controllers\Provider\ServiceController::class, 'deactivate'])->name('services.deactivate');
        Route::patch('/services/{service}/activate', [\App\Http\Controllers\Provider\ServiceController::class, 'activate'])->name('services.activate');
       
        Route::get('/bookings', [\App\Http\Controllers\Provider\BookingController::class, 'index'])->name('bookings.index');
        Route::patch('/bookings/{booking}/accept', [\App\Http\Controllers\Provider\BookingController::class, 'accept'])->name('bookings.accept');
        Route::patch('/bookings/{booking}/decline', [\App\Http\Controllers\Provider\BookingController::class, 'decline'])->name('bookings.decline');
        Route::patch('/bookings/{booking}/complete', [\App\Http\Controllers\Provider\BookingController::class, 'complete'])->name('bookings.complete');

        });
    });

    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
       Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pendingProviders' => \App\Models\ProviderProfile::where('status', 'pending')->count(),
                'totalProviders' => \App\Models\ProviderProfile::where('status', 'approved')->count(),
                'totalCustomers' => \App\Models\User::where('role', 'customer')->count(),
                'totalBookings' => \App\Models\Booking::count(),
            ],
        ]); 
    })->name('dashboard');

    Route::get('/providers', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'index'])
        ->name('providers.index');
    Route::patch('/providers/{providerProfile}/approve', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'approve'])
        ->name('providers.approve');
    Route::patch('/providers/{providerProfile}/reject', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'reject'])
        ->name('providers.reject');
    Route::patch('/providers/{providerProfile}/suspend', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'suspend'])
        ->name('providers.suspend');
    Route::patch('/providers/{providerProfile}/unsuspend', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'unsuspend'])
        ->name('providers.unsuspend');
    Route::get('/providers/{providerProfile}', [\App\Http\Controllers\Admin\ProviderApprovalController::class, 'show'])
        ->name('providers.show');

    Route::get('/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('bookings.index');
    Route::get('/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'show'])->name('bookings.show');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';