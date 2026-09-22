import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

/* ---------- Static option lists ---------- */
const categoryOptions = [
    { value: '',           label: 'Semua kategori' },
    { value: 'aircon',     label: 'Aircond' },
    { value: 'plumbing',   label: 'Paip' },
    { value: 'cleaning',   label: 'Pembersihan' },
    { value: 'electrical', label: 'Elektrik' },
];

const districtOptions = [
    { value: '',              label: 'Semua kawasan' },
    { value: 'parit_buntar',  label: 'Parit Buntar' },
    { value: 'kuala_kangsar', label: 'Kuala Kangsar' },
    { value: 'taiping',       label: 'Taiping' },
    { value: 'ipoh',          label: 'Ipoh' },
    { value: 'teluk_intan',   label: 'Teluk Intan' },
];

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
    Search: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="9" cy="9" r="5.5" />
            <path d="M14 14l3 3" />
        </svg>
    ),
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
    ArrowLeft: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
    ),
    Close: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 5l10 10M15 5L5 15" />
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

const getProviderInitial = (p) => getProviderName(p).charAt(0).toUpperCase();

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

const stripHtml = (html) => {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').trim();
};

/* ============================ PAGE ============================ */
export default function Browse({ providers, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');

    const rows = providers?.data ?? [];

    /* ---------- Apply a filter ---------- */
    const applyFilter = (key, value) => {
        const next = { ...filters, [key]: value };

        Object.keys(next).forEach((k) => {
            if (next[k] === '' || next[k] == null) delete next[k];
        });

        router.get(route('browse'), next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const submitSearch = (e) => {
        e.preventDefault();
        applyFilter('search', search.trim());
    };

    const clearFilters = () => {
        setSearch('');
        router.get(route('browse'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const filterCount = ['category', 'district', 'search'].filter(
        (k) => filters[k]
    ).length;

    return (
        <MainLayout>
            <Head title="Cari tukang — Tukang Perak" />

            {/* ============ HEADER + FILTERS ============ */}
            <section className="border-b border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                        <span className="h-px w-6 bg-emerald-700" />
                        CARI TUKANG
                    </p>

                    <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 sm:text-5xl">
                        Tukang tempatan di seluruh Perak.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                        Tapis mengikut kategori, kawasan, atau cari mengikut nama
                        perniagaan.
                    </p>

                    {/* ---------- Search + filters ---------- */}
                    <form
                        onSubmit={submitSearch}
                        className="mt-8 flex flex-col gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 shadow-sm sm:flex-row sm:items-center"
                    >
                        <div className="relative flex flex-1 items-center">
                            <Icon.Search
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                style={{ width: 16, height: 16 }}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama perniagaan..."
                                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            />
                        </div>

                        <select
                            value={filters.category ?? ''}
                            onChange={(e) => applyFilter('category', e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 sm:w-44"
                        >
                            {categoryOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.district ?? ''}
                            onChange={(e) => applyFilter('district', e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 sm:w-44"
                        >
                            {districtOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
                        >
                            <Icon.Search style={{ width: 14, height: 14 }} />
                            Cari
                        </button>
                    </form>

                    {/* ---------- Active filter chips ---------- */}
                    {filterCount > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-stone-500">
                                Tapisan aktif:
                            </span>

                            {filters.search && (
                                <FilterChip
                                    label={`“${filters.search}”`}
                                    onRemove={() => {
                                        setSearch('');
                                        applyFilter('search', '');
                                    }}
                                />
                            )}
                            {filters.category && (
                                <FilterChip
                                    label={getCategoryLabel(filters.category)}
                                    onRemove={() => applyFilter('category', '')}
                                />
                            )}
                            {filters.district && (
                                <FilterChip
                                    label={getDistrictLabel(filters.district)}
                                    onRemove={() => applyFilter('district', '')}
                                />
                            )}

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="ml-1 text-xs font-bold text-emerald-700 underline-offset-4 hover:underline"
                            >
                                Kosongkan semua
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ============ RESULTS ============ */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="font-serif text-2xl tracking-tight text-stone-900">
                            {rows.length > 0
                                ? `${providers.total ?? rows.length} tukang ditemui`
                                : 'Tiada tukang ditemui'}
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                            {providers.from ?? 0}–{providers.to ?? 0} daripada{' '}
                            {providers.total ?? 0}
                        </p>
                    </div>
                </div>

                {/* Empty states */}
                {rows.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Icon.Wrench style={{ width: 24, height: 24 }} />
                        </span>
                        <h3 className="mt-4 font-serif text-xl tracking-tight text-stone-900">
                            {filterCount > 0
                                ? 'Tiada tukang sepadan dengan tapisan anda'
                                : 'Belum ada tukang berdaftar'}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                            {filterCount > 0
                                ? 'Cuba longgarkan tapisan atau cari kawasan berdekatan.'
                                : 'Penyedia perkhidmatan akan dipaparkan di sini apabila mereka mendaftar.'}
                        </p>

                        {filterCount > 0 && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
                            >
                                Kosongkan tapisan
                                <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                            </button>
                        )}
                    </div>
                ) : (
                    /* ---------- Provider grid ---------- */
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {rows.map((provider) => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                )}

                {/* ---------- Pagination ---------- */}
                {providers?.links && providers.links.length > 3 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                        {providers.links.map((link, i) => {
                            const isPrev = i === 0;
                            const isNext = i === providers.links.length - 1;
                            const label = stripHtml(link.label);

                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-400 opacity-50"
                                    >
                                        {isPrev && (
                                            <Icon.ArrowLeft
                                                style={{ width: 12, height: 12 }}
                                            />
                                        )}
                                        {isPrev
                                            ? 'Sebelum'
                                            : isNext
                                            ? 'Seterusnya'
                                            : label}
                                        {isNext && (
                                            <Icon.ArrowRight
                                                style={{ width: 12, height: 12 }}
                                            />
                                        )}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    preserveScroll
                                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                        link.active
                                            ? 'border-emerald-700 bg-emerald-700 text-white'
                                            : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:text-emerald-700'
                                    }`}
                                >
                                    {isPrev && (
                                        <Icon.ArrowLeft
                                            style={{ width: 12, height: 12 }}
                                        />
                                    )}
                                    {isPrev
                                        ? 'Sebelum'
                                        : isNext
                                        ? 'Seterusnya'
                                        : label}
                                    {isNext && (
                                        <Icon.ArrowRight
                                            style={{ width: 12, height: 12 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}

/* ---------- Filter chip ---------- */
function FilterChip({ label, onRemove }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="grid h-4 w-4 place-items-center rounded-full text-emerald-700 transition hover:bg-emerald-200"
                aria-label={`Buang tapisan ${label}`}
            >
                <Icon.Close style={{ width: 10, height: 10 }} />
            </button>
        </span>
    );
}

/* ---------- Provider card ---------- */
function ProviderCard({ provider }) {
    const name = getProviderName(provider);
    const servicesCount = getServicesCount(provider);
    const cheapest = getCheapestService(provider);

    const rating = provider.rating ?? provider.average_rating ?? null;
    const reviews = provider.review_count ?? provider.reviews_count ?? null;

    return (
        <Link
            href={route('providers.show', provider.id)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-900/5"
        >
            {/* Identity */}
            <div className="flex items-start gap-4 p-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                    {provider.photo_path ? (
                        <img
                            src={`/storage/${provider.photo_path}`}
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
                        {rating != null && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                                <Icon.Star style={{ width: 11, height: 11 }} />
                                {Number(rating).toFixed(1)}
                            </span>
                        )}
                        {reviews != null && reviews > 0 ? (
                            <span className="text-stone-500">
                                ({reviews} ulasan)
                            </span>
                        ) : (
                            <span className="text-stone-500">Disahkan</span>
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
                    <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                </span>
            </div>
        </Link>
    );
}