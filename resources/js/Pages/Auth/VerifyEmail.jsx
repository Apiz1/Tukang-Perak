import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

/* ---------- Small icons ---------- */
const Icon = {
    Mail: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="5" width="14" height="10" rx="2" />
            <path d="M3 7l7 5 7-5" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Logout: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M12 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h5a2 2 0 002-2v-2" />
            <path d="M9 10h8M14 7l3 3-3 3" />
        </svg>
    ),
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
        </svg>
    ),
};

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Sahkan e-mel — Tukang Perak" />

            <div className="auth-card w-full max-w-md">
                {/* ---------- Brand ---------- */}
                <Link
                    href={route('home')}
                    className="group mb-10 inline-flex items-center gap-3"
                >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm shadow-emerald-900/20 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                        T
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-stone-900">
                        Tukang<span className="text-emerald-700">Perak</span>
                    </span>
                </Link>

                {/* ---------- Icon + heading ---------- */}
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                    <Icon.Mail style={{ width: 26, height: 26 }} />
                </span>

                <p className="eyebrow mt-6">SAHKAN E-MEL</p>
                <h1 className="mt-3 font-serif text-4xl leading-[1.15] tracking-tight text-stone-900">
                    Satu langkah lagi.
                </h1>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                    Terima kasih kerana mendaftar! Sebelum bermula, sila sahkan
                    alamat e-mel anda dengan menekan pautan yang telah kami
                    hantar. Jika anda tidak menerimanya, kami boleh hantar
                    semula.
                </p>

                {/* ---------- Success status ---------- */}
                {status === 'verification-link-sent' && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                            <Icon.Check style={{ width: 12, height: 12 }} />
                        </span>
                        <p className="text-sm leading-6 text-emerald-800">
                            Pautan pengesahan baharu telah dihantar ke alamat
                            e-mel yang anda berikan semasa mendaftar.
                        </p>
                    </div>
                )}

                {/* ---------- Actions ---------- */}
                <form onSubmit={submit} className="mt-8 space-y-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 transition-all duration-200 hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-900/15 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                    >
                        {processing ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Menghantar...
                            </>
                        ) : (
                            <>
                                Hantar semula e-mel pengesahan
                                <Icon.ArrowRight
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                    style={{ width: 14, height: 14 }}
                                />
                            </>
                        )}
                    </button>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                    >
                        <Icon.Logout style={{ width: 14, height: 14 }} />
                        Log keluar
                    </Link>
                </form>

                {/* ---------- Helper ---------- */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-stone-200 bg-white/60 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                        <Icon.Info style={{ width: 16, height: 16 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-stone-900">
                            Tidak nampak e-mel?
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-stone-500">
                            Semak folder spam atau promosi anda. Pautan
                            pengesahan akan luput selepas 60 minit — hantar
                            semula jika perlu.
                        </p>
                    </div>
                </div>

                {/* ---------- Footer ---------- */}
                <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-600">
                    Perlukan bantuan?{' '}
                    <a
                        href="mailto:hello@tukangperak.my"
                        className="font-bold text-emerald-700 underline-offset-4 transition hover:text-emerald-900 hover:underline"
                    >
                        Hubungi sokongan
                    </a>
                </div>
            </div>
        </GuestLayout>
    );
}