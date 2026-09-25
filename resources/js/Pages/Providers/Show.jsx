import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

/* ---------- Small icons ---------- */
const Icon = {
    ArrowLeft: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Pin: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" />
            <circle cx="10" cy="8" r="2.2" />
        </svg>
    ),
    Star: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Mail: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="5" width="14" height="10" rx="2" />
            <path d="M3 7l7 5 7-5" />
        </svg>
    ),
    Phone: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 4l2-1 2 3-1.5 1.5a10 10 0 004 4L12 10l3 2-1 2c-6 0-10-4-10-10z" />
        </svg>
    ),
    Clock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 1.8" />
        </svg>
    ),
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
        </svg>
    ),
    Calendar: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
    ),
    Lock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="4" y="9" width="12" height="8" rx="2" />
            <path d="M7 9V6.5a3 3 0 116 0V9" />
        </svg>
    ),
};

/* ---------- Static label maps ---------- */
const categoryLabels = {
    aircon: 'Aircond',
    plumbing: 'Paip',
    cleaning: 'Pembersihan',
    electrical: 'Elektrik',
};

const districtLabels = {
    parit_buntar:  'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping:       'Taiping',
    ipoh:          'Ipoh',
    teluk_intan:   'Teluk Intan',
};

const priceTypeLabels = {
    fixed:  'Harga tetap',
    hourly: 'Mengikut jam',
};

/* ---------- Helpers ---------- */
const formatCurrency = (value) =>
    value == null
        ? '—'
        : new Intl.NumberFormat('ms-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
          }).format(value);

const formatServicePrice = (service) => {
    if (service?.base_price == null) return '—';
    const base = formatCurrency(service.base_price);
    return service.price_type === 'hourly' ? `${base} / jam` : base;
};

const getProviderName = (p) =>
    p?.business_name ?? p?.user?.name ?? 'Penyedia perkhidmatan';

const getProviderInitial = (p) => getProviderName(p).charAt(0).toUpperCase();

const getCategoryLabel = (v) => categoryLabels[v] ?? v ?? '—';
const getDistrictLabel = (v) => districtLabels[v] ?? v ?? 'Perak';

/* ============================ PAGE ============================ */
export default function Show({ provider }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    const name = getProviderName(provider);
    const services = Array.isArray(provider?.services) ? provider.services : [];

    const rating = provider?.rating ?? provider?.average_rating ?? null;
    const reviews = provider?.review_count ?? provider?.reviews_count ?? null;

    /* Who can book?
       - Logged-in customer: yes
       - Guest: show a "Log masuk" CTA
       - Provider/Admin: hidden — they can't book their own services */
    const isCustomer = user?.role === 'customer';
    const isGuest = !user;
    const canBook = isCustomer;

    return (
        <MainLayout>
            <Head title={`${name} — Tukang Perak`} />

            <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
                {/* ---------- Back link ---------- */}
                <Link
                    href="/browse"
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
                >
                    <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                    Kembali ke senarai tukang
                </Link>

                {/* ============ HERO CARD ============ */}
                <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white">
                    <div className="h-24 bg-gradient-to-br from-emerald-700 to-emerald-900 sm:h-28" />

                    <div className="px-5 pb-6 sm:px-8 sm:pb-8">
                        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-800 shadow-lg sm:h-28 sm:w-28">
                                    {provider?.photo_path ? (
                                        <img
                                            src={`/storage/${provider.photo_path}`}
                                            alt={name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getProviderInitial(provider)
                                    )}
                                </div>

                                <div className="pb-1">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                        <Icon.Shield style={{ width: 10, height: 10 }} />
                                        Disahkan
                                    </span>
                                </div>
                            </div>

                            {provider?.user?.email && (
                                <a
                                    href={`mailto:${provider.user.email}`}
                                    className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md sm:self-auto"
                                >
                                    <Icon.Mail style={{ width: 14, height: 14 }} />
                                    Hubungi tukang
                                </a>
                            )}
                        </div>

                        <div className="mt-5">
                            <h1 className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                                {name}
                            </h1>

                            {provider?.business_name &&
                                provider.business_name !== provider.user?.name && (
                                    <p className="mt-1 text-sm text-stone-500">
                                        Didaftarkan oleh{' '}
                                        <span className="font-semibold text-stone-700">
                                            {provider.user?.name}
                                        </span>
                                    </p>
                                )}

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {provider?.category && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                                        <Icon.Wrench
                                            style={{
                                                width: 12,
                                                height: 12,
                                                color: 'var(--green, #176b4d)',
                                            }}
                                        />
                                        {getCategoryLabel(provider.category)}
                                    </span>
                                )}
                                {provider?.district && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                                        <Icon.Pin
                                            style={{
                                                width: 12,
                                                height: 12,
                                                color: 'var(--green, #176b4d)',
                                            }}
                                        />
                                        {getDistrictLabel(provider.district)}
                                    </span>
                                )}
                                {rating != null && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                        <Icon.Star style={{ width: 11, height: 11 }} />
                                        {Number(rating).toFixed(1)}
                                        {reviews ? ` (${reviews} ulasan)` : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============ MAIN GRID ============ */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                    {/* LEFT */}
                    <div className="flex flex-col gap-6">
                        {provider?.description && (
                            <div className="rounded-2xl border border-stone-200 bg-white p-6">
                                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                                    <span className="h-px w-5 bg-emerald-700" />
                                    TENTANG TUKANG INI
                                </p>
                                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">
                                    {provider.description}
                                </p>
                            </div>
                        )}

                        {/* ============ SERVICES ============ */}
                        <div className="rounded-2xl border border-stone-200 bg-white">
                            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
                                <div>
                                    <h2 className="font-serif text-xl tracking-tight text-stone-900">
                                        Perkhidmatan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-stone-500">
                                        {services.length > 0
                                            ? `${services.length} perkhidmatan ditawarkan`
                                            : 'Belum ada perkhidmatan'}
                                    </p>
                                </div>
                            </div>

                            {services.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                        <Icon.Wrench style={{ width: 20, height: 20 }} />
                                    </span>
                                    <p className="text-sm font-semibold text-stone-800">
                                        Belum ada perkhidmatan disenaraikan
                                    </p>
                                    <p className="max-w-xs text-xs text-stone-500">
                                        Tukang ini belum menambah perkhidmatan
                                        mereka. Hubungi mereka untuk pertanyaan.
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-stone-200">
                                    {services.map((service) => (
                                        <li key={service.id} className="p-5 sm:p-6">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                                                        <Icon.Wrench
                                                            style={{ width: 16, height: 16 }}
                                                        />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-bold text-stone-900">
                                                            {service.title}
                                                        </h3>
                                                        {service.description && (
                                                            <p className="mt-1 text-sm leading-6 text-stone-600">
                                                                {service.description}
                                                            </p>
                                                        )}
                                                        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                                                            <Icon.Clock
                                                                style={{
                                                                    width: 10,
                                                                    height: 10,
                                                                }}
                                                            />
                                                            {priceTypeLabels[
                                                                service.price_type
                                                            ] ?? service.price_type}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="shrink-0 sm:text-right">
                                                    <p className="font-serif text-xl tracking-tight text-emerald-700">
                                                        {formatServicePrice(service)}
                                                    </p>

                                                    {/* 🆕 Book button — role-aware */}
                                                    {canBook ? (
                                                        /* Customer: real book link */
                                                        <Link
                                                            href={`/services/${service.id}/book`}
                                                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                                                        >
                                                            <Icon.Calendar
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                }}
                                                            />
                                                            Tempah
                                                            <Icon.ArrowRight
                                                                style={{
                                                                    width: 11,
                                                                    height: 11,
                                                                }}
                                                            />
                                                        </Link>
                                                    ) : isGuest ? (
                                                        /* Guest: prompt to log in */
                                                        <Link
                                                            href="/login"
                                                            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                                        >
                                                            <Icon.Lock
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                }}
                                                            />
                                                            Log masuk untuk menempah
                                                        </Link>
                                                    ) : (
                                                        /* Provider/Admin: disabled */
                                                        <span
                                                            title="Hanya pelanggan boleh menempah"
                                                            className="mt-2 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-400"
                                                        >
                                                            <Icon.Calendar
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                }}
                                                            />
                                                            Tempah
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                        {(provider?.user?.email || provider?.user?.phone_number) && (
                            <div className="rounded-2xl border border-stone-200 bg-white p-5">
                                <h3 className="text-sm font-bold text-stone-900">
                                    Maklumat hubungan
                                </h3>
                                <p className="mt-1 text-xs text-stone-500">
                                    Hubungi tukang untuk pertanyaan atau tempahan
                                </p>

                                <div className="mt-4 flex flex-col gap-2">
                                    {provider.user.email && (
                                        <a
                                            href={`mailto:${provider.user.email}`}
                                            className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                                        >
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                                <Icon.Mail
                                                    style={{ width: 14, height: 14 }}
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                                    E-mel
                                                </span>
                                                <span className="block truncate text-sm font-semibold text-stone-800">
                                                    {provider.user.email}
                                                </span>
                                            </span>
                                        </a>
                                    )}

                                    {provider.user.phone_number && (
                                        <a
                                            href={`tel:${provider.user.phone_number}`}
                                            className="group flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                                        >
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                                <Icon.Phone
                                                    style={{ width: 14, height: 14 }}
                                                />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                                    Telefon
                                                </span>
                                                <span className="block truncate text-sm font-semibold text-stone-800">
                                                    {provider.user.phone_number}
                                                </span>
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                                    <Icon.Shield style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-stone-900">
                                        Tukang disahkan
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-stone-600">
                                        Profil ini telah melalui proses
                                        pengesahan oleh pasukan Tukang Perak.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-stone-200 bg-white p-5">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                                    <Icon.Info style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-stone-900">
                                        Sebelum menempah
                                    </p>
                                    <ul className="mt-2 space-y-1.5 text-xs leading-5 text-stone-600">
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                            Sahkan skop kerja dan harga dahulu.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                            Setuju tarikh dan masa sebelum
                                            bayaran.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                            Simpan komunikasi melalui platform.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
}