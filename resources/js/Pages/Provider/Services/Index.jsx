import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small inline icons ---------- */
const Icon = {
    Plus: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 4v12M4 10h12" />
        </svg>
    ),
    Search: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="9" cy="9" r="5.5" />
            <path d="M14 14l3 3" />
        </svg>
    ),
    Filter: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 5h14M6 10h8M9 15h2" />
        </svg>
    ),
    Edit: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14 3l3 3-9 9-4 1 1-4 9-9z" />
        </svg>
    ),
    Trash: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    X: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 5l10 10M15 5L5 15" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
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

const priceTypeLabels = {
    fixed:  'Harga tetap',
    hourly: 'Mengikut jam',
    quote:  'Sebut harga',
};

/* ---------- Status pill ---------- */
function ActivePill({ isActive }) {
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                isActive
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-stone-200 bg-stone-100 text-stone-600'
            }`}
        >
            {isActive ? (
                <Icon.Check style={{ width: 10, height: 10 }} />
            ) : (
                <Icon.X style={{ width: 10, height: 10 }} />
            )}
            {isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ services = [] }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [processing, setProcessing] = useState(null);

    /* Delete confirmation modal */
    const [deletingService, setDeletingService] = useState(null);

    /* 🆕 Toggle (activate / deactivate) confirmation modal */
    const [togglingService, setTogglingService] = useState(null);
    // { service: {...}, action: 'activate' | 'deactivate' }

    const filtered = useMemo(() => {
        return services.filter((s) => {
            const matchesQuery =
                !query ||
                s.title?.toLowerCase().includes(query.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && s.is_active) ||
                (statusFilter === 'inactive' && !s.is_active);

            return matchesQuery && matchesStatus;
        });
    }, [services, query, statusFilter]);

    const activeCount = services.filter((s) => s.is_active).length;
    const inactiveCount = services.length - activeCount;

    /* ---------- Open toggle confirmation ---------- */
    const askToggle = (service, action) => {
        setTogglingService({ service, action });
    };

    /* ---------- Fire the toggle request ---------- */
    const confirmToggle = () => {
        if (!togglingService) return;
        const { service, action } = togglingService;

        setProcessing(service.id);

        const url =
            action === 'deactivate'
                ? route('provider.services.deactivate', service.id)
                : route('provider.services.activate', service.id);

        router.patch(
            url,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(null);
                    setTogglingService(null);
                },
            }
        );
    };

    /* ---------- Delete flow ---------- */
    const askDelete = (service) => setDeletingService(service);

    const confirmDelete = () => {
        if (!deletingService) return;
        setProcessing(deletingService.id);
        router.delete(route('provider.services.destroy', deletingService.id), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(null);
                setDeletingService(null);
            },
        });
    };

    return (
        <ProviderLayout title="Perkhidmatan saya" breadcrumb="Perkhidmatan">
            <Head title="Perkhidmatan saya — Tukang Perak" />

            {/* ---------- Page heading ---------- */}
            <div className="provider-page-header">
                <p className="eyebrow">PERKHIDMATAN</p>
                <h1 className="provider-page-heading mt-3">
                    Perkhidmatan saya.
                </h1>
                <p className="provider-page-subtitle">
                    Senaraikan perkhidmatan yang anda tawarkan supaya pelanggan
                    tahu apa yang anda boleh buat dan berapa harganya.
                </p>
            </div>

            {/* ---------- Summary tiles ---------- */}
            {services.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-3">
                    <div className="provider-stat">
                        <p className="provider-stat__label">Jumlah perkhidmatan</p>
                        <p className="provider-stat__value">{services.length}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Semua perkhidmatan yang anda tawarkan
                        </p>
                    </div>
                    <div className="provider-stat">
                        <p className="provider-stat__label">Aktif</p>
                        <p className="provider-stat__value">{activeCount}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Dipaparkan kepada pelanggan
                        </p>
                    </div>
                    <div className="provider-stat">
                        <p className="provider-stat__label">Tidak aktif</p>
                        <p className="provider-stat__value">{inactiveCount}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Disembunyikan sementara
                        </p>
                    </div>
                </section>
            )}

            {/* ---------- Toolbar ---------- */}
            {services.length > 0 && (
                <div className="mt-6 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:max-w-xs">
                        <Icon.Search
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari perkhidmatan..."
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* Status filter + Add button */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Icon.Filter
                            className="text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { value: 'all',      label: 'Semua' },
                                { value: 'active',   label: 'Aktif' },
                                { value: 'inactive', label: 'Tidak Aktif' },
                            ].map((tab) => {
                                const active = statusFilter === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                            active
                                                ? 'border-[color:var(--green)] bg-[color:var(--green)] text-white'
                                                : 'border-[color:var(--line)] bg-white text-[color:var(--muted)] hover:border-[#a9cdb4] hover:text-[color:var(--green)]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <Link
                            href="/provider/services/create"
                            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--green)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)]"
                        >
                            <Icon.Plus style={{ width: 14, height: 14 }} />
                            Tambah perkhidmatan
                        </Link>
                    </div>
                </div>
            )}

            {/* ---------- Empty state (no services at all) ---------- */}
            {services.length === 0 ? (
                <div className="provider-card">
                    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Wrench style={{ width: 28, height: 28 }} />
                        </span>
                        <h2 className="font-serif text-2xl tracking-tight text-[color:var(--ink)]">
                            Belum ada perkhidmatan
                        </h2>
                        <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                            Tambah perkhidmatan pertama anda untuk mula
                            menerima tempahan daripada pelanggan di seluruh
                            Perak.
                        </p>
                        <Link
                            href="/provider/services/create"
                            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[color:var(--green)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] hover:shadow-md"
                        >
                            <Icon.Plus style={{ width: 16, height: 16 }} />
                            Tambah perkhidmatan pertama
                        </Link>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                /* ---------- Empty filtered state ---------- */
                <div className="provider-card">
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--paper)] text-[color:var(--muted)]">
                            <Icon.Search style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Tiada perkhidmatan sepadan
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Cuba tukar carian atau penapis status anda.
                        </p>
                    </div>
                </div>
            ) : (
                /* ---------- Services list ---------- */
                <div className="provider-card overflow-hidden">
                    <div className="provider-card__header">
                        <h2 className="provider-card__title">
                            {filtered.length === services.length
                                ? `${services.length} perkhidmatan`
                                : `${filtered.length} daripada ${services.length} perkhidmatan`}
                        </h2>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[color:var(--line)] bg-[color:var(--paper)]/60">
                                    <Th>Perkhidmatan</Th>
                                    <Th>Jenis harga</Th>
                                    <Th>Harga</Th>
                                    <Th>Status</Th>
                                    <Th align="right">Tindakan</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--line)]">
                                {filtered.map((service) => (
                                    <tr
                                        key={service.id}
                                        className="transition hover:bg-[color:var(--paper)]/40"
                                    >
                                        {/* Title + description preview */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-start gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                                    <Icon.Wrench style={{ width: 16, height: 16 }} />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                        {service.title}
                                                    </p>
                                                    {service.description && (
                                                        <p className="mt-0.5 line-clamp-1 max-w-xs truncate text-xs text-[color:var(--muted)]">
                                                            {service.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Price type */}
                                        <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                            {priceTypeLabels[service.price_type] ??
                                                service.price_type ??
                                                '—'}
                                        </td>

                                        {/* Price */}
                                        <td className="px-4 py-3.5 text-sm font-semibold text-[color:var(--green-dark)]">
                                            {service.price_type === 'quote'
                                                ? 'Sebut harga'
                                                : formatCurrency(service.base_price)}
                                        </td>

                                        {/* Status pill */}
                                        <td className="px-4 py-3.5">
                                            <ActivePill isActive={service.is_active} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Toggle active */}
                                                <button
                                                    type="button"
                                                    disabled={processing === service.id}
                                                    onClick={() =>
                                                        askToggle(
                                                            service,
                                                            service.is_active
                                                                ? 'deactivate'
                                                                : 'activate'
                                                        )
                                                    }
                                                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                        service.is_active
                                                            ? 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                                                    }`}
                                                    title={
                                                        service.is_active
                                                            ? 'Sembunyikan daripada pelanggan'
                                                            : 'Tunjuk kepada pelanggan'
                                                    }
                                                >
                                                    {service.is_active ? (
                                                        <>
                                                            <Icon.X style={{ width: 12, height: 12 }} />
                                                            Nyahaktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Icon.Check style={{ width: 12, height: 12 }} />
                                                            Aktifkan
                                                        </>
                                                    )}
                                                </button>

                                                {/* Edit */}
                                                <Link
                                                    href={`/provider/services/${service.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-1.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                                >
                                                    <Icon.Edit style={{ width: 12, height: 12 }} />
                                                    Sunting
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    disabled={processing === service.id}
                                                    onClick={() => askDelete(service)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <Icon.Trash style={{ width: 12, height: 12 }} />
                                                    Padam
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <ul className="divide-y divide-[color:var(--line)] md:hidden">
                        {filtered.map((service) => (
                            <li key={service.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                            <Icon.Wrench style={{ width: 16, height: 16 }} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                {service.title}
                                            </p>
                                            {service.description && (
                                                <p className="mt-0.5 line-clamp-2 text-xs text-[color:var(--muted)]">
                                                    {service.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <ActivePill isActive={service.is_active} />
                                </div>

                                {/* Price row */}
                                <div className="mt-3 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                                    <span className="rounded-md bg-[color:var(--paper)] px-2 py-0.5 font-semibold">
                                        {priceTypeLabels[service.price_type] ??
                                            service.price_type ??
                                            '—'}
                                    </span>
                                    {service.price_type !== 'quote' && service.base_price != null && (
                                        <span className="font-bold text-[color:var(--green-dark)]">
                                            {formatCurrency(service.base_price)}
                                        </span>
                                    )}
                                    {service.price_type === 'quote' && (
                                        <span className="font-bold text-[color:var(--green-dark)]">
                                            Sebut harga
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        disabled={processing === service.id}
                                        onClick={() =>
                                            askToggle(
                                                service,
                                                service.is_active
                                                    ? 'deactivate'
                                                    : 'activate'
                                            )
                                        }
                                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                            service.is_active
                                                ? 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {service.is_active ? (
                                            <>
                                                <Icon.X style={{ width: 12, height: 12 }} />
                                                Nyahaktif
                                            </>
                                        ) : (
                                            <>
                                                <Icon.Check style={{ width: 12, height: 12 }} />
                                                Aktifkan
                                            </>
                                        )}
                                    </button>

                                    <Link
                                        href={`/provider/services/${service.id}/edit`}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-2 text-xs font-bold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                    >
                                        <Icon.Edit style={{ width: 12, height: 12 }} />
                                        Sunting
                                    </Link>

                                    <button
                                        type="button"
                                        disabled={processing === service.id}
                                        onClick={() => askDelete(service)}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Icon.Trash style={{ width: 12, height: 12 }} />
                                        Padam
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ---------- Toggle confirmation modal ---------- */}
            {togglingService && (
                <ConfirmToggleModal
                    service={togglingService.service}
                    action={togglingService.action}
                    processing={processing === togglingService.service.id}
                    onCancel={() => {
                        if (processing) return;
                        setTogglingService(null);
                    }}
                    onConfirm={confirmToggle}
                />
            )}

            {/* ---------- Delete confirmation modal ---------- */}
            {deletingService && (
                <ConfirmDeleteModal
                    service={deletingService}
                    processing={processing === deletingService.id}
                    onCancel={() => {
                        if (processing) return;
                        setDeletingService(null);
                    }}
                    onConfirm={confirmDelete}
                />
            )}
        </ProviderLayout>
    );
}

/* ---------- Table header cell helper ---------- */
function Th({ children, align = 'left' }) {
    return (
        <th
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)] text-${align}`}
        >
            {children}
        </th>
    );
}

/* ============================ TOGGLE MODAL ============================ */
function ConfirmToggleModal({ service, action, processing, onCancel, onConfirm }) {
    const isDeactivate = action === 'deactivate';

    const config = isDeactivate
        ? {
              tone: 'stone',
              icon: <Icon.X style={{ width: 26, height: 26 }} />,
              title: 'Nyahaktifkan perkhidmatan ini?',
              message:
                  'Perkhidmatan ini akan disembunyikan daripada pelanggan. Anda boleh mengaktifkannya semula pada bila-bila masa.',
              confirmLabel: 'Ya, nyahaktifkan',
          }
        : {
              tone: 'emerald',
              icon: <Icon.Check style={{ width: 26, height: 26 }} />,
              title: 'Aktifkan perkhidmatan ini?',
              message:
                  'Perkhidmatan ini akan dipaparkan kepada pelanggan dan boleh ditempah semula.',
              confirmLabel: 'Ya, aktifkan',
          };

    const toneClasses =
        config.tone === 'emerald'
            ? {
                  iconWrap: 'bg-emerald-50 text-emerald-700',
                  confirmBtn:
                      'bg-[color:var(--green)] hover:bg-[color:var(--green-dark)] text-white',
              }
            : {
                  iconWrap: 'bg-stone-100 text-stone-700',
                  confirmBtn: 'bg-stone-800 hover:bg-stone-900 text-white',
              };

    /* Escape to cancel, Enter to confirm */
    useEffect(() => {
        const onKey = (e) => {
            if (processing) return;
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onCancel, onConfirm, processing]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="toggle-modal-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div
                        className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${toneClasses.iconWrap}`}
                    >
                        {config.icon}
                    </div>

                    <h2
                        id="toggle-modal-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                    >
                        {config.title}
                    </h2>

                    {/* Service summary */}
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Wrench style={{ width: 16, height: 16 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {service.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                {priceTypeLabels[service.price_type] ??
                                    service.price_type}{' '}
                                ·{' '}
                                {service.price_type === 'quote'
                                    ? 'Sebut harga'
                                    : formatCurrency(service.base_price)}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                        {config.message}
                    </p>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={processing}
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                        >
                            Tidak, batal
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={processing}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-1 ${toneClasses.confirmBtn}`}
                        >
                            {processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Memproses...
                                </>
                            ) : (
                                config.confirmLabel
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                        Tekan ESC untuk batal
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ============================ DELETE MODAL ============================ */
function ConfirmDeleteModal({ service, processing, onCancel, onConfirm }) {
    /* Escape to cancel, Enter to confirm */
    useEffect(() => {
        const onKey = (e) => {
            if (processing) return;
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onCancel, onConfirm, processing]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                        <Icon.Alert style={{ width: 26, height: 26 }} />
                    </div>

                    <h2
                        id="delete-modal-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                    >
                        Padam perkhidmatan ini?
                    </h2>

                    {/* Service summary */}
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Wrench style={{ width: 16, height: 16 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {service.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                {priceTypeLabels[service.price_type] ??
                                    service.price_type}{' '}
                                ·{' '}
                                {service.price_type === 'quote'
                                    ? 'Sebut harga'
                                    : formatCurrency(service.base_price)}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                        Perkhidmatan ini akan dipadamkan secara kekal. Tindakan
                        ini tidak boleh dibatalkan.
                    </p>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={processing}
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                        >
                            Tidak, batal
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-1"
                        >
                            {processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Memadam...
                                </>
                            ) : (
                                'Ya, padam'
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                        Tekan ESC untuk batal
                    </p>
                </div>
            </div>
        </div>
    );
}