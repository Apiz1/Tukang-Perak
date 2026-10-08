import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Tetapkan kata laluan baharu — Tukang Perak" />

            {/* ---------- Header ---------- */}
            <div className="mb-6">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    <span className="h-px w-5 bg-emerald-700" />
                    KATA LALUAN BAHARU
                </p>
                <h1 className="mt-2 font-serif text-2xl tracking-tight text-stone-900">
                    Tetapkan kata laluan baharu
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                    Pilih kata laluan yang kukuh dan mudah anda ingat.
                    Sekurang-kurangnya 8 aksara.
                </p>
            </div>

            {/* ---------- Form ---------- */}
            <form onSubmit={submit} className="space-y-5">
                {/* Email (read-only context) */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-stone-800"
                    >
                        E-mel
                    </label>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Akaun yang anda tetapkan semula
                    </p>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        readOnly
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-2 w-full cursor-not-allowed rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 outline-none"
                    />

                    {errors.email && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-stone-800"
                    >
                        Kata laluan baharu
                    </label>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Sekurang-kurangnya 8 aksara
                    </p>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                        className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />

                    {errors.password && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Password confirmation */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-semibold text-stone-800"
                    >
                        Sahkan kata laluan
                    </label>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Taip semula kata laluan yang sama
                    </p>

                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        placeholder="••••••••"
                        className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />

                    {errors.password_confirmation && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                {/* ---------- Actions ---------- */}
                <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                    >
                        Kembali ke log masuk
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                Tetapkan kata laluan
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                >
                                    <path d="M4 10h12M11 5l5 5-5 5" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}