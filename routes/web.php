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

Route::post('/billplz/callback', \App\Http\Controllers\BillplzCallbackController::class)->name('billplz.callback');

Route::middleware(['auth', 'verified', 'account.active'])->group(function () {
    Route::get('/dashboard', DashboardRedirectController::class)->name('dashboard.redirect');
    Route::get('/services/{service}/book', [\App\Http\Controllers\Customer\BookingController::class, 'create'])->name('services.book');
    Route::post('/services/{service}/book', [\App\Http\Controllers\Customer\BookingController::class, 'store'])->name('services.book.store');

    Route::patch('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::patch('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    Route::post('/bookings/{booking}/messages', [\App\Http\Controllers\MessageController::class, 'store'])->name('bookings.messages.store');

    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::get('/dashboard', \App\Http\Controllers\Customer\DashboardController::class)->name('dashboard');
        
        Route::get('/bookings', [\App\Http\Controllers\Customer\BookingController::class, 'index'])->name('bookings.index');
        Route::get('/bookings/{booking}', [\App\Http\Controllers\Customer\BookingController::class, 'show'])->name('bookings.show');
        Route::patch('/bookings/{booking}/cancel', [\App\Http\Controllers\Customer\BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::post('/bookings/{booking}/review', [\App\Http\Controllers\Customer\ReviewController::class, 'store'])->name('bookings.review');

        Route::post('/bookings/{booking}/pay', [\App\Http\Controllers\Customer\PaymentController::class, 'store'])->name('bookings.pay');
        Route::get('/payments/return', [\App\Http\Controllers\Customer\PaymentController::class, 'return'])->name('payments.return');

        Route::patch('/bookings/{booking}/confirm', [\App\Http\Controllers\Customer\BookingController::class, 'confirm'])->name('bookings.confirm');
        Route::post('/bookings/{booking}/dispute', [\App\Http\Controllers\Customer\BookingController::class, 'dispute'])->name('bookings.dispute');

        Route::get('/saved-providers', [\App\Http\Controllers\Customer\SavedProviderController::class, 'index'])->name('saved-providers.index');
        Route::post('/providers/{providerProfile}/save', [\App\Http\Controllers\Customer\SavedProviderController::class, 'store'])->name('providers.save');
        Route::delete('/providers/{providerProfile}/save', [\App\Http\Controllers\Customer\SavedProviderController::class, 'destroy'])->name('providers.unsave');

        Route::get('/providers/{providerProfile}/report', [\App\Http\Controllers\Customer\ReportController::class, 'create'])->name('providers.report.create');
        Route::post('/providers/{providerProfile}/report', [\App\Http\Controllers\Customer\ReportController::class, 'store'])->middleware('throttle:5,1')->name('providers.report.store');
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
        Route::patch('/bookings/{booking}/mark-work-done', [\App\Http\Controllers\Provider\BookingController::class, 'markWorkDone'])->name('bookings.mark-work-done');
        Route::get('/bookings/{booking}', [\App\Http\Controllers\Provider\BookingController::class, 'show'])->name('bookings.show');

        Route::get('/reviews', [\App\Http\Controllers\Provider\ReviewController::class, 'index'])->name('reviews.index');
        Route::patch('/reviews/{review}/reply', [\App\Http\Controllers\Provider\ReviewController::class, 'reply'])->name('reviews.reply');

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
                'platformRevenue' => \App\Models\Payment::where('status', 'released')->sum('platform_fee'),
                'totalGmv' => \App\Models\Payment::where('status', 'released')->sum('amount'),
                'heldInEscrow' => \App\Models\Payment::where('status', 'held')->sum('amount'),
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

    Route::get('/payments', [\App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('payments.index');
    Route::patch('/payments/{payment}/release', [\App\Http\Controllers\Admin\PaymentController::class, 'release'])->name('payments.release');
    Route::patch('/payments/{payment}/refund', [\App\Http\Controllers\Admin\PaymentController::class, 'refund'])->name('payments.refund');

    Route::get('/customers', [\App\Http\Controllers\Admin\CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{user}', [\App\Http\Controllers\Admin\CustomerController::class, 'show'])->name('customers.show');
    Route::patch('/customers/{user}/suspend', [\App\Http\Controllers\Admin\CustomerController::class, 'suspend'])->name('customers.suspend');
    Route::patch('/customers/{user}/unsuspend', [\App\Http\Controllers\Admin\CustomerController::class, 'unsuspend'])->name('customers.unsuspend');
    
    Route::get('/reports', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{report}', [\App\Http\Controllers\Admin\ReportController::class, 'show'])->name('reports.show');
    Route::patch('/reports/{report}', [\App\Http\Controllers\Admin\ReportController::class, 'update'])->name('reports.update');
        
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';