import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa kata laluan — Tukang Perak" />

            {/* ---------- Header ---------- */}
            <div className="mb-6">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    <span className="h-px w-5 bg-emerald-700" />
                    LUPA KATA LALUAN
                </p>
                <h1 className="mt-2 font-serif text-2xl tracking-tight text-stone-900">
                    Tetapkan semula kata laluan
                </h1>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                    Masukkan alamat e-mel akaun anda. Kami akan hantar pautan
                    untuk menetapkan kata laluan baharu.
                </p>
            </div>

            {/* ---------- Status flash (e.g. reset link sent) ---------- */}
            {status && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                        ✓
                    </span>
                    <p className="text-xs leading-5 text-emerald-800">
                        {status}
                    </p>
                </div>
            )}

            {/* ---------- Form ---------- */}
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-stone-800"
                    >
                        E-mel
                    </label>
                    <p className="mt-0.5 text-xs text-stone-500">
                        Alamat e-mel yang anda daftarkan
                    </p>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="nama@contoh.com"
                        className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />

                    {errors.email && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            {errors.email}
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
                                Menghantar...
                            </>
                        ) : (
                            <>
                                Hantar pautan reset
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