import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Static option lists ---------- */
const categoryOptions = [
    { value: 'aircon',     label: 'Aircond Repair & Servicing' },
    { value: 'plumbing',   label: 'Plumbing' },
    { value: 'cleaning',   label: 'House Cleaning' },
    { value: 'electrical', label: 'Electrical' },
];

const districtOptions = [
    { value: 'parit_buntar',  label: 'Parit Buntar' },
    { value: 'kuala_kangsar', label: 'Kuala Kangsar' },
    { value: 'taiping',       label: 'Taiping' },
    { value: 'ipoh',          label: 'Ipoh' },
    { value: 'teluk_intan',   label: 'Teluk Intan' },
];

/* ---------- Small icons ---------- */
const Icon = {
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    MapPin: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" />
            <circle cx="10" cy="8" r="2.2" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
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

export default function Reapply({ providerProfile }) {
    const { flash } = usePage().props;

    const { data, setData, patch, processing, errors } = useForm({
        category: providerProfile?.category ?? '',
        district: providerProfile?.district ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('provider.reapply.update'));
    };

    const reason = providerProfile?.rejection_reason;

    return (
        <ProviderLayout title="Mohon semula" breadcrumb="Akaun">
            <Head title="Mohon semula — Tukang Perak" />

            <div className="mx-auto w-full max-w-2xl">
                {/* ============ REJECTED BANNER ============ */}
                <div className="mb-6 flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                        <Icon.Alert style={{ width: 18, height: 18 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-rose-900">
                            Aplikasi anda tidak diluluskan
                        </p>
                        <p className="mt-1 text-sm leading-6 text-rose-800/90">
                            Jangan risau — anda boleh kemas kini maklumat di bawah
                            dan hantar semula untuk semakan.
                        </p>

                        {reason && (
                            <div className="mt-3 rounded-lg border border-rose-200 bg-white/70 p-3">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-rose-700">
                                    Sebab penolakan
                                </p>
                                <p className="mt-1 text-sm leading-6 text-rose-900">
                                    {reason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============ FLASH ============ */}
                {flash?.status && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                            ✓
                        </span>
                        <p className="text-sm font-medium text-emerald-800">
                            {flash.status}
                        </p>
                    </div>
                )}

                {/* ============ HEADER ============ */}
                <div className="provider-page-header">
                    <p className="eyebrow">MOHON SEMULA</p>
                    <h1 className="provider-page-heading mt-3">
                        Betulkan maklumat anda.
                    </h1>
                    <p className="provider-page-subtitle">
                        Pastikan kategori dan daerah anda betul sebelum menghantar
                        semula. Pasukan kami akan menyemak dalam masa 1–2 hari
                        bekerja.
                    </p>
                </div>

                {/* ============ FORM CARD ============ */}
                <form onSubmit={submit} className="space-y-6">
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Wrench style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="provider-card__title">
                                        Maklumat perkhidmatan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Pilih kategori dan kawasan operasi anda
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="provider-card__body space-y-5">
                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="block text-sm font-semibold text-[color:var(--ink)]"
                                >
                                    Kategori perkhidmatan
                                </label>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    Pilih satu kategori yang paling sesuai
                                </p>

                                <div className="relative mt-2">
                                    <select
                                        id="category"
                                        name="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        required
                                        className="w-full appearance-none rounded-xl border border-[color:var(--line)] bg-white py-3 pl-4 pr-10 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                    >
                                        <option value="">Pilih kategori</option>
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">
                                        ▾
                                    </span>
                                </div>

                                {errors.category && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            {/* District */}
                            <div>
                                <label
                                    htmlFor="district"
                                    className="block text-sm font-semibold text-[color:var(--ink)]"
                                >
                                    Daerah
                                </label>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    Daerah utama anda beroperasi di Perak
                                </p>

                                <div className="relative mt-2">
                                    <select
                                        id="district"
                                        name="district"
                                        value={data.district}
                                        onChange={(e) =>
                                            setData('district', e.target.value)
                                        }
                                        required
                                        className="w-full appearance-none rounded-xl border border-[color:var(--line)] bg-white py-3 pl-4 pr-10 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                    >
                                        <option value="">Pilih daerah</option>
                                        {districtOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>

                                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">
                                        ▾
                                    </span>
                                </div>

                                {errors.district && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.district}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ---------- What happens next ---------- */}
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--warm)] text-[color:var(--ink)]">
                                <Icon.Info style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-[color:var(--ink)]">
                                    Apa yang berlaku selepas ini?
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[color:var(--muted)]">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Permohonan anda akan disemak oleh pasukan kami.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Anda akan dimaklumkan melalui e-mel dalam masa
                                        1–2 hari bekerja.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Semua menu akan dibuka apabila diluluskan.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Actions ---------- */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/provider"
                            className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)]"
                        >
                            Kembali ke papan pemuka
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--green)] px-6 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-[color:var(--green-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                        >
                            {processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Menghantar...
                                </>
                            ) : (
                                <>
                                    Hantar semula untuk semakan
                                    <Icon.ArrowRight
                                        className="transition-transform group-hover:translate-x-0.5"
                                        style={{ width: 14, height: 14 }}
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ---------- Support footer ---------- */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                        <Icon.Shield style={{ width: 16, height: 16 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Perlukan bantuan?
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                            Jika anda rasa keputusan ini tidak tepat, hubungi
                            pasukan sokongan kami di{' '}
                            <a
                                href="mailto:hello@tukangperak.my"
                                className="font-semibold text-[color:var(--green)] underline-offset-4 hover:underline"
                            >
                                hello@tukangperak.my
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </ProviderLayout>
    );
}