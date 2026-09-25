import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ---------- Small inline icons ---------- */
const Icon = {
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
    Calendar: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
    ),
    Clock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 1.8" />
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
    Inbox: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 10l2-6h10l2 6v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
            <path d="M3 10h4l1 2h4l1-2h4" />
        </svg>
    ),
    Eye: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M1.5 10s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6S1.5 10 1.5 10z" />
            <circle cx="10" cy="10" r="2.5" />
        </svg>
    ),
};

/* ---------- Status config ---------- */
const statusMap = {
    requested: { label: 'Menunggu',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    accepted:  { label: 'Diterima',   cls: 'bg-sky-50 text-sky-700 border-sky-200' },
    declined:  { label: 'Ditolak',    cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    completed: { label: 'Selesai',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Dibatalkan', cls: 'bg-stone-100 text-stone-600 border-stone-300' },
};

function StatusPill({ status }) {
    const s = statusMap[status] ?? statusMap.requested;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.cls}`}
        >
            {status === 'requested' && <Icon.Clock style={{ width: 10, height: 10 }} />}
            {status === 'accepted'  && <Icon.Check style={{ width: 10, height: 10 }} />}
            {status === 'declined'  && <Icon.X     style={{ width: 10, height: 10 }} />}
            {status === 'completed' && <Icon.Check style={{ width: 10, height: 10 }} />}
            {status === 'cancelled' && <Icon.X     style={{ width: 10, height: 10 }} />}
            {s.label}
        </span>
    );
}

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

const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const stripHtml = (html) => {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').trim();
};

const getCustomerName = (b) =>
    b.customer?.name ?? b.customer_name ?? 'Pelanggan';

const getProviderName = (b) =>
    b.provider_profile?.business_name ??
    b.provider_profile?.user?.name ??
    b.provider_name ??
    'Tukang';

const getServiceTitle = (b) =>
    b.service?.title ?? b.service_title ?? 'Perkhidmatan';

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, tone = 'emerald' }) {
    const tones = {
        emerald: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber:   'bg-amber-50 text-amber-700',
        sky:     'bg-sky-50 text-sky-700',
        rose:    'bg-rose-50 text-rose-700',
        stone:   'bg-stone-100 text-stone-700',
    };

    return (
        <div className="admin-stat">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="admin-stat__label">{label}</p>
                    <p className="admin-stat__value">{value}</p>
                    {hint && (
                        <p className="mt-1 text-xs text-[color:var(--muted)]">{hint}</p>
                    )}
                </div>
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
                    <Icon.Calendar style={{ width: 18, height: 18 }} />
                </span>
            </div>
        </div>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ bookings, filters = {} }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');

    const rows = bookings?.data ?? [];

    const filtered = useMemo(() => {
        return rows.filter((b) => {
            const matchesQuery =
                !query ||
                getCustomerName(b).toLowerCase().includes(query.toLowerCase()) ||
                getProviderName(b).toLowerCase().includes(query.toLowerCase()) ||
                getServiceTitle(b).toLowerCase().includes(query.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || b.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [rows, query, statusFilter]);

    const counts = useMemo(() => ({
        total:     rows.length,
        requested: rows.filter((b) => b.status === 'requested').length,
        accepted:  rows.filter((b) => b.status === 'accepted').length,
        completed: rows.filter((b) => b.status === 'completed').length,
    }), [rows]);

    /* ---------- Apply status filter via URL ---------- */
    const applyStatusFilter = (status) => {
        setStatusFilter(status);

        const next = { ...filters };
        if (status === 'all' || !status) {
            delete next.status;
        } else {
            next.status = status;
        }

        router.get('/admin/bookings', next, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <AdminLayout title="Tempahan" breadcrumb="Pentadbiran">
            <Head title="Tempahan — Admin Tukang Perak" />

            {/* ---------- Page heading ---------- */}
            <div className="admin-page-header">
                <p className="eyebrow">PENGURUSAN</p>
                <h1 className="admin-page-heading mt-3">Semua tempahan.</h1>
                <p className="admin-page-subtitle">
                    Pantau semua tempahan di platform, tapis mengikut status,
                    dan buka butiran untuk siasatan.
                </p>
            </div>

            {/* ---------- Stat tiles ---------- */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Jumlah tempahan"
                        value={counts.total}
                        hint="Sepanjang masa"
                        tone="emerald"
                    />
                    <StatCard
                        label="Menunggu"
                        value={counts.requested}
                        hint="Belum disahkan"
                        tone="amber"
                    />
                    <StatCard
                        label="Diterima"
                        value={counts.accepted}
                        hint="Sedang berjalan"
                        tone="sky"
                    />
                    <StatCard
                        label="Selesai"
                        value={counts.completed}
                        hint="Kerja tamat"
                        tone="emerald"
                    />
                </section>
            )}

            {/* ---------- Toolbar ---------- */}
            {rows.length > 0 && (
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
                            placeholder="Cari pelanggan, tukang atau perkhidmatan..."
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-2">
                        <Icon.Filter
                            className="text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { value: 'all',       label: 'Semua' },
                                { value: 'requested', label: 'Menunggu' },
                                { value: 'accepted',  label: 'Diterima' },
                                { value: 'declined',  label: 'Ditolak' },
                                { value: 'completed', label: 'Selesai' },
                                { value: 'cancelled', label: 'Dibatalkan' },
                            ].map((tab) => {
                                const active = statusFilter === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => applyStatusFilter(tab.value)}
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
                    </div>
                </div>
            )}

            {/* ---------- Table card ---------- */}
            <div className="admin-card overflow-hidden">
                <div className="admin-card__header">
                    <h2 className="admin-card__title">
                        {filtered.length === rows.length
                            ? `${rows.length} tempahan`
                            : `${filtered.length} daripada ${rows.length} tempahan`}
                    </h2>
                </div>

                {filtered.length === 0 ? (
                    /* ---------- Empty state ---------- */
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Inbox style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            {rows.length === 0
                                ? 'Belum ada tempahan'
                                : 'Tiada tempahan sepadan'}
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            {rows.length === 0
                                ? 'Tempahan pelanggan akan muncul di sini apabila ada.'
                                : 'Cuba tukar carian atau penapis status anda.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ---------- Desktop table ---------- */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[color:var(--line)] bg-[color:var(--paper)]/60">
                                        <Th>Pelanggan</Th>
                                        <Th>Tukang</Th>
                                        <Th>Perkhidmatan</Th>
                                        <Th>Tarikh</Th>
                                        <Th>Harga</Th>
                                        <Th>Status</Th>
                                        <Th align="right">Tindakan</Th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[color:var(--line)]">
                                    {filtered.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="transition hover:bg-[color:var(--paper)]/40"
                                        >
                                            {/* Customer */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-xs font-bold text-[color:var(--green-dark)]">
                                                        {booking.customer?.avatar_url ? (
                                                            <img
                                                                src={booking.customer.avatar_url}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            getCustomerName(booking).charAt(0).toUpperCase()
                                                        )}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                            {getCustomerName(booking)}
                                                        </p>
                                                        {booking.customer?.phone_number && (
                                                            <p className="truncate text-xs text-[color:var(--muted)]">
                                                                {booking.customer.phone_number}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Provider */}
                                            <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                                {getProviderName(booking)}
                                            </td>

                                            {/* Service */}
                                            <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                                {getServiceTitle(booking)}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                                {formatDate(booking.preferred_date)}
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3.5 text-sm font-semibold text-[color:var(--green-dark)]">
                                                {formatCurrency(booking.price)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5">
                                                <StatusPill status={booking.status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3.5 text-right">
                                                <Link
                                                    href={`/admin/bookings/${booking.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                                >
                                                    <Icon.Eye style={{ width: 12, height: 12 }} />
                                                    Lihat
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ---------- Mobile cards ---------- */}
                        <ul className="divide-y divide-[color:var(--line)] md:hidden">
                            {filtered.map((booking) => (
                                <li key={booking.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                                                    {booking.customer?.avatar_url ? (
                                                        <img
                                                            src={booking.customer.avatar_url}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        getCustomerName(booking).charAt(0).toUpperCase()
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                        {getCustomerName(booking)}
                                                    </p>
                                                    <p className="truncate text-xs text-[color:var(--muted)]">
                                                        {getServiceTitle(booking)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                                                <span className="rounded-md bg-[color:var(--paper)] px-2 py-0.5 font-semibold">
                                                    {getProviderName(booking)}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Icon.Calendar style={{ width: 11, height: 11 }} />
                                                    {formatDate(booking.preferred_date)}
                                                </span>
                                                {booking.price != null && (
                                                    <span className="font-bold text-[color:var(--green-dark)]">
                                                        {formatCurrency(booking.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <StatusPill status={booking.status} />
                                    </div>

                                    <Link
                                        href={`/admin/bookings/${booking.id}`}
                                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                    >
                                        <Icon.Eye style={{ width: 12, height: 12 }} />
                                        Lihat butiran penuh
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {/* ---------- Pagination ---------- */}
                {bookings?.links && bookings.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[color:var(--line)] px-4 py-3 sm:flex-row">
                        <p className="text-xs text-[color:var(--muted)]">
                            Menunjukkan {bookings.from ?? 0}–{bookings.to ?? 0} daripada{' '}
                            {bookings.total ?? 0} tempahan
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {bookings.links.map((link, i) => {
                                const isPrev = i === 0;
                                const isNext = i === bookings.links.length - 1;
                                const label = stripHtml(link.label);

                                if (!link.url) {
                                    return (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[color:var(--muted)] opacity-50"
                                        >
                                            {isPrev && <Icon.ArrowLeft style={{ width: 12, height: 12 }} />}
                                            {isPrev ? 'Sebelum' : isNext ? 'Seterusnya' : label}
                                            {isNext && <Icon.ArrowRight style={{ width: 12, height: 12 }} />}
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                                            link.active
                                                ? 'border-[color:var(--green)] bg-[color:var(--green)] text-white'
                                                : 'border-[color:var(--line)] bg-white text-[color:var(--muted)] hover:border-[#a9cdb4] hover:text-[color:var(--green)]'
                                        }`}
                                    >
                                        {isPrev && <Icon.ArrowLeft style={{ width: 12, height: 12 }} />}
                                        {isPrev ? 'Sebelum' : isNext ? 'Seterusnya' : label}
                                        {isNext && <Icon.ArrowRight style={{ width: 12, height: 12 }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
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