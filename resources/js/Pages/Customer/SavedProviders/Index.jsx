import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

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

/* ---------- Small icons ---------- */
const Icon = {
    Pin: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" />
            <circle cx="10" cy="8" r="2.2" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Star: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Heart: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 17s-7-4.5-7-9.5A3.5 3.5 0 0110 5a3.5 3.5 0 017 2.5C17 12.5 10 17 10 17z" />
        </svg>
    ),
    HeartOutline: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 17s-7-4.5-7-9.5A3.5 3.5 0 0110 5a3.5 3.5 0 017 2.5C17 12.5 10 17 10 17z" />
        </svg>
    ),
    Search: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="9" cy="9" r="5.5" />
            <path d="M14 14l3 3" />
        </svg>
    ),
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

const getProviderName = (p) =>
    p.business_name ?? p.user?.name ?? 'Penyedia perkhidmatan';

const getProviderInitial = (p) =>
    getProviderName(p).charAt(0).toUpperCase();

const getProviderPhoto = (p) =>
    p.photo_path ? `/storage/${p.photo_path}` : null;

const getCategoryLabel = (v) => categoryLabels[v] ?? v ?? '—';
const getDistrictLabel = (v) => districtLabels[v] ?? v ?? 'Perak';

const getServicesCount = (p) => {
    if (Array.isArray(p.services)) return p.services.length;
    if (typeof p.services_count === 'number') return p.services_count;
    return null;
};

const getCheapestService = (p) => {
    if (!Array.isArray(p.services) || p.services.length === 0) return null;
    return p.services.reduce((min, s) => {
        const price = Number(s.base_price ?? 0);
        return !min || price < min.price ? { price, service: s } : min;
    }, null);
};

/* ============================ PAGE ============================ */
export default function Index({ savedProviders = [] }) {
    const rows = Array.isArray(savedProviders)
        ? savedProviders
        : savedProviders.data ?? [];

    const handleUnsave = (providerId) => {
        router.delete(route('providers.unsave', providerId), {
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Tukang disimpan — Tukang Perak" />

            {/* ============ HEADER ============ */}
            <section className="border-b border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                        <span className="h-px w-6 bg-emerald-700" />
                        SENARAI SIMPANAN
                    </p>

                    <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 sm:text-5xl">
                        Tukang yang anda simpan.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                        Senarai tukang yang anda simpan untuk rujukan kemudian.
                        Klik untuk lihat profil atau buang dari senarai.
                    </p>
                </div>
            </section>

            {/* ============ RESULTS ============ */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                {/* Summary row */}
                {rows.length > 0 && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="font-serif text-2xl tracking-tight text-stone-900">
                                {rows.length} tukang disimpan
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Semua tukang yang anda tandakan
                            </p>
                        </div>

                        <Link
                            href={route('browse')}
                            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700 sm:self-auto"
                        >
                            <Icon.Search style={{ width: 14, height: 14 }} />
                            Cari tukang lain
                        </Link>
                    </div>
                )}

                {/* Empty state */}
                {rows.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Icon.HeartOutline
                                style={{ width: 24, height: 24 }}
                            />
                        </span>
                        <h3 className="mt-4 font-serif text-xl tracking-tight text-stone-900">
                            Belum ada tukang disimpan
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                            Simpan tukang yang anda suka untuk cari mereka
                            semula dengan cepat.
                        </p>

                        <Link
                            href={route('browse')}
                            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
                        >
                            <Icon.Search style={{ width: 14, height: 14 }} />
                            Cari tukang
                            <Icon.ArrowRight
                                style={{ width: 14, height: 14 }}
                            />
                        </Link>
                    </div>
                ) : (
                    /* Provider grid */
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rows.map((provider) => (
                            <SavedProviderCard
                                key={provider.id}
                                provider={provider}
                                onUnsave={handleUnsave}
                            />
                        ))}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}

/* ---------- Saved provider card ---------- */
function SavedProviderCard({ provider, onUnsave }) {
    const name = getProviderName(provider);
    const photo = getProviderPhoto(provider);
    const servicesCount = getServicesCount(provider);
    const cheapest = getCheapestService(provider);

    const rating =
        provider.reviews_avg_rating ??
        provider.rating ??
        provider.average_rating ??
        null;
    const reviews =
        provider.reviews_count ?? provider.review_count ?? null;
    const hasReviews = reviews != null && reviews > 0 && rating != null;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-900/5">
            {/* Unsave button */}
            <button
                type="button"
                onClick={() => onUnsave(provider.id)}
                aria-label="Buang dari senarai simpanan"
                title="Buang dari senarai simpanan"
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-rose-100 bg-white/90 text-rose-600 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-700"
            >
                <Icon.Heart style={{ width: 16, height: 16 }} />
            </button>

            {/* Clickable content */}
            <Link
                href={route('providers.show', provider.id)}
                className="flex flex-1 flex-col"
            >
                {/* Identity */}
                <div className="flex items-start gap-4 p-5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                        {photo ? (
                            <img
                                src={photo}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            getProviderInitial(provider)
                        )}
                    </span>

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-stone-900 transition group-hover:text-emerald-700">
                            {name}
                        </h3>

                        {provider.category && (
                            <p className="mt-0.5 truncate text-sm text-stone-600">
                                {getCategoryLabel(provider.category)}
                            </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            {hasReviews ? (
                                <>
                                    <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                                        <Icon.Star
                                            style={{ width: 11, height: 11 }}
                                        />
                                        {Number(rating).toFixed(1)}
                                    </span>
                                    <span className="text-stone-500">
                                        ({reviews} ulasan)
                                    </span>
                                </>
                            ) : (
                                <span className="text-stone-500">
                                    Disahkan
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-stone-100 px-5 py-3 text-xs text-stone-500">
                    {provider.district && (
                        <span className="inline-flex items-center gap-1">
                            <Icon.Pin style={{ width: 11, height: 11 }} />
                            {getDistrictLabel(provider.district)}
                        </span>
                    )}
                    {servicesCount != null && (
                        <span className="inline-flex items-center gap-1">
                            <Icon.Wrench style={{ width: 11, height: 11 }} />
                            {servicesCount} perkhidmatan
                        </span>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="mt-auto flex items-center justify-between border-t border-stone-100 bg-stone-50/60 px-5 py-3">
                    <span className="text-xs font-semibold text-stone-700">
                        {cheapest
                            ? `Dari ${formatCurrency(cheapest.price)}`
                            : 'Harga boleh dirunding'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition group-hover:translate-x-0.5">
                        Lihat profil
                        <Icon.ArrowRight
                            style={{ width: 12, height: 12 }}
                        />
                    </span>
                </div>
            </Link>
        </div>
    );
}