<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone_number' => 'required|string|max:20',
            'role' => 'required|in:customer,provider',
            'category' => 'required_if:role,provider|nullable|string|max:255',
            'district' => 'required_if:role,provider|nullable|string|max:255',
            'identity_document' => 'required_if:role,provider|nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'ssm_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'certificate_document' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        if ($user->role === 'provider') {
        $providerProfile = $user->providerProfile()->create([
            'category' => $request->category,
            'district' => $request->district,
        ]);

        foreach (['identity', 'ssm', 'certificate'] as $type) {
            if ($request->hasFile("{$type}_document")) {
                $providerProfile->storeDocument($type, $request->file("{$type}_document"));
            }
        }

        $admins = User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\AdminAlertNotification(
            "Tukang baharu ({$user->name}) menunggu kelulusan",
            route('admin.providers.show', $providerProfile)
        ));
    }

        event(new Registered($user));

        ActivityLog::record(
            'user.registered',
            "Pengguna baharu ({$user->role}): {$user->name}",
            $user,
            userId: $user->id,
        );

        Auth::login($user);

        return redirect(route('dashboard.redirect'));
    }
}
