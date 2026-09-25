import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small icons ---------- */
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
    Phone: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 4l2-1 2 3-1.5 1.5a10 10 0 004 4L12 10l3 2-1 2c-6 0-10-4-10-10z" />
        </svg>
    ),
    Pin: (p) => (
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
    ArrowLeft: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Inbox: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 10l2-6h10l2 6v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
            <path d="M3 10h4l1 2h4l1-2h4" />
        </svg>
    ),
};

/* ---------- Status config ---------- */
const statusConfig = {
    requested: {
        label: 'Menunggu',
        cls: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: Icon.Clock,
    },
    accepted: {
        label: 'Diterima',
        cls: 'border-sky-200 bg-sky-50 text-sky-700',
        icon: Icon.Check,
    },
    completed: {
        label: 'Selesai',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: Icon.Check,
    },
    declined: {
        label: 'Ditolak',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
        icon: Icon.X,
    },
    cancelled: {
        label: 'Dibatalkan',
        cls: 'border-stone-200 bg-stone-100 text-stone-600',
        icon: Icon.X,
    },
};

const districtLabels = {
    parit_buntar:  'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping:       'Taiping',
    ipoh:          'Ipoh',
    teluk_intan:   'Teluk Intan',
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

const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const getCustomerName = (booking) =>
    booking.customer?.name ?? booking.customer_name ?? 'Pelanggan';

const getCustomerInitial = (booking) =>
    getCustomerName(booking).charAt(0).toUpperCase();

/* ---------- Status pill ---------- */
function StatusPill({ status }) {
    const config = statusConfig[status] ?? statusConfig.requested;
    const StatusIcon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.cls}`}
        >
            <StatusIcon style={{ width: 10, height: 10 }} />
            {config.label}
        </span>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ bookings = [] }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    /* Modal state — { type: 'accept' | 'decline' | 'complete', booking: {...} } */
    const [confirmAction, setConfirmAction] = useState(null);
    const [processing, setProcessing] = useState(false);

    const rows = Array.isArray(bookings) ? bookings : bookings.data ?? [];

    const filtered = useMemo(() => {
        return rows.filter((b) => {
            const matchesQuery =
                !query ||
                b.service?.title?.toLowerCase().includes(query.toLowerCase()) ||
                getCustomerName(b).toLowerCase().includes(query.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || b.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [rows, query, statusFilter]);

    const counts = useMemo(
        () => ({
            total:     rows.length,
            requested: rows.filter((b) => b.status === 'requested').length,
            accepted:  rows.filter((b) => b.status === 'accepted').length,
            completed: rows.filter((b) => b.status === 'completed').length,
        }),
        [rows]
    );

    /* ---------- Open the confirmation modal ---------- */
    const ask = (type, booking) => setConfirmAction({ type, booking });
    const closeModal = () => {
        if (processing) return;
        setConfirmAction(null);
    };

    /* ---------- Run the actual action ---------- */
    const runAction = () => {
        if (!confirmAction) return;
        const { type, booking } = confirmAction;

        const urls = {
            accept:   route('provider.bookings.accept', booking.id),
            decline:  route('provider.bookings.decline', booking.id),
            complete: route('provider.bookings.complete', booking.id),
        };

        setProcessing(true);
        router.patch(urls[type], {}, {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setConfirmAction(null);
            },
        });
    };

    return (
        <ProviderLayout title="Tempahan masuk" breadcrumb="Tempahan">
            <Head title="Tempahan masuk — Tukang Perak" />

            {/* ============ HEADER ============ */}
            <div className="provider-page-header">
                <p className="eyebrow">TEMPAHAN</p>
                <h1 className="provider-page-heading mt-3">
                    Tempahan masuk.
                </h1>
                <p className="provider-page-subtitle">
                    Semak permintaan pelanggan, terima kerja, dan tanda selesai
                    apabila kerja siap.
                </p>
            </div>

            {/* ============ STAT TILES ============ */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="provider-stat">
                        <p className="provider-stat__label">Jumlah</p>
                        <p className="provider-stat__value">{counts.total}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Semua tempahan
                        </p>
                    </div>
                    <div className="provider-stat">
                        <p className="provider-stat__label">Menunggu</p>
                        <p className="provider-stat__value">{counts.requested}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Perlu tindakan
                        </p>
                    </div>
                    <div className="provider-stat">
                        <p className="provider-stat__label">Diterima</p>
                        <p className="provider-stat__value">{counts.accepted}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Sedang berjalan
                        </p>
                    </div>
                    <div className="provider-stat">
                        <p className="provider-stat__label">Selesai</p>
                        <p className="provider-stat__value">{counts.completed}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Sepanjang masa
                        </p>
                    </div>
                </section>
            )}

            {/* ============ TOOLBAR ============ */}
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
                            placeholder="Cari pelanggan atau perkhidmatan..."
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* Status filter */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Icon.Filter
                            className="text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { value: 'all',       label: 'Semua' },
                                { value: 'requested', label: 'Menunggu' },
                                { value: 'accepted',  label: 'Diterima' },
                                { value: 'completed', label: 'Selesai' },
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
                    </div>
                </div>
            )}

            {/* ============ EMPTY STATES ============ */}
            {rows.length === 0 ? (
                <div className="provider-card">
                    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Inbox style={{ width: 28, height: 28 }} />
                        </span>
                        <h2 className="font-serif text-2xl tracking-tight text-[color:var(--ink)]">
                            Belum ada tempahan
                        </h2>
                        <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                            Apabila pelanggan menempah perkhidmatan anda, ia akan
                            muncul di sini.
                        </p>
                        <Link
                            href="/provider/services"
                            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[color:var(--green)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] hover:shadow-md"
                        >
                            <Icon.Wrench style={{ width: 16, height: 16 }} />
                            Urus perkhidmatan saya
                        </Link>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="provider-card">
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--paper)] text-[color:var(--muted)]">
                            <Icon.Search style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Tiada tempahan sepadan
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Cuba tukar carian atau penapis status anda.
                        </p>
                    </div>
                </div>
            ) : (
                /* ============ BOOKINGS LIST ============ */
                <div className="flex flex-col gap-4">
                    {filtered.map((booking) => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            onAsk={ask}
                            processing={processing && confirmAction?.booking?.id === booking.id}
                        />
                    ))}
                </div>
            )}

            {/* ============ CONFIRM MODAL ============ */}
            {confirmAction && (
                <ConfirmModal
                    action={confirmAction}
                    processing={processing}
                    onCancel={closeModal}
                    onConfirm={runAction}
                />
            )}
        </ProviderLayout>
    );
}

/* ============================ BOOKING CARD ============================ */
function BookingCard({ booking, onAsk, processing }) {
    const customerName = getCustomerName(booking);
    const status = booking.status ?? 'requested';

    const canAccept = status === 'requested';
    const canDecline = status === 'requested';
    const canComplete = status === 'accepted';

    return (
        <article className="provider-card overflow-hidden">
            <div className="p-5 sm:p-6">
                {/* Top row: customer + status */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--lime)] text-base font-bold text-[color:var(--green-dark)]">
                            {booking.customer?.avatar_url ? (
                                <img
                                    src={booking.customer.avatar_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getCustomerInitial(booking)
                            )}
                        </span>

                        <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-[color:var(--ink)]">
                                {booking.service?.title ?? 'Tempahan'}
                            </h3>
                            <p className="mt-0.5 truncate text-sm text-[color:var(--muted)]">
                                {customerName}
                                {booking.customer?.phone_number &&
                                    ` · ${booking.customer.phone_number}`}
                            </p>
                        </div>
                    </div>

                    <StatusPill status={status} />
                </div>

                {/* Details grid */}
                <dl className="mt-5 grid gap-4 border-t border-[color:var(--line)] pt-5 sm:grid-cols-2">
                    <DetailItem
                        icon={<Icon.Calendar style={{ width: 13, height: 13 }} />}
                        label="Tarikh pilihan"
                        value={formatDate(booking.preferred_date)}
                    />
                    <DetailItem
                        icon={<Icon.Pin style={{ width: 13, height: 13 }} />}
                        label="Daerah"
                        value={
                            districtLabels[booking.district] ??
                            booking.district ??
                            '—'
                        }
                    />
                    <div className="sm:col-span-2">
                        <DetailItem
                            icon={<Icon.Pin style={{ width: 13, height: 13 }} />}
                            label="Alamat"
                            value={booking.address ?? '—'}
                        />
                    </div>
                    {booking.notes && (
                        <div className="sm:col-span-2">
                            <DetailItem
                                icon={<Icon.Clock style={{ width: 13, height: 13 }} />}
                                label="Nota pelanggan"
                                value={booking.notes}
                                multiline
                            />
                        </div>
                    )}
                </dl>
            </div>

            {/* Footer with actions */}
            <div className="flex flex-col gap-3 border-t border-[color:var(--line)] bg-[color:var(--paper)]/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-bold text-[color:var(--green-dark)]">
                    {formatCurrency(booking.price)}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                    {booking.customer?.phone_number && (
                        <a
                            href={`tel:${booking.customer.phone_number}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                        >
                            <Icon.Phone style={{ width: 12, height: 12 }} />
                            Hubungi
                        </a>
                    )}

                    {canAccept && (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => onAsk('accept', booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--green)] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Icon.Check style={{ width: 12, height: 12 }} />
                            Terima
                        </button>
                    )}

                    {canDecline && (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => onAsk('decline', booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Icon.X style={{ width: 12, height: 12 }} />
                            Tolak
                        </button>
                    )}

                    {canComplete && (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => onAsk('complete', booking)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--green)] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Icon.Check style={{ width: 12, height: 12 }} />
                            Tanda selesai
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ---------- Detail item helper ---------- */
function DetailItem({ icon, label, value, multiline = false }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[color:var(--paper)] text-[color:var(--muted)]">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                    {label}
                </p>
                <p
                    className={`mt-0.5 text-sm font-semibold text-[color:var(--ink)] ${
                        multiline ? 'whitespace-pre-line leading-6' : 'truncate'
                    }`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

/* ============================ CONFIRM MODAL ============================ */
function ConfirmModal({ action, processing, onCancel, onConfirm }) {
    const { type, booking } = action;

    const config = {
        accept: {
            tone: 'emerald',
            icon: <Icon.Check style={{ width: 26, height: 26 }} />,
            title: 'Terima tempahan ini?',
            message:
                'Tempahan akan disahkan dan pelanggan boleh menghubungi anda untuk aturan seterusnya.',
            confirmLabel: 'Ya, terima',
        },
        decline: {
            tone: 'rose',
            icon: <Icon.X style={{ width: 26, height: 26 }} />,
            title: 'Tolak tempahan ini?',
            message:
                'Pelanggan akan dimaklumkan bahawa tempahan ini tidak dapat diterima.',
            confirmLabel: 'Ya, tolak',
        },
        complete: {
            tone: 'emerald',
            icon: <Icon.Check style={{ width: 26, height: 26 }} />,
            title: 'Tanda selesai?',
            message:
                'Kerja akan ditandakan sebagai selesai. Pastikan pelanggan telah menerima perkhidmatan.',
            confirmLabel: 'Ya, tanda selesai',
        },
    }[type];

    const toneClasses =
        config.tone === 'emerald'
            ? {
                  iconWrap: 'bg-emerald-50 text-emerald-700',
                  confirmBtn:
                      'bg-[color:var(--green)] hover:bg-[color:var(--green-dark)] text-white',
              }
            : {
                  iconWrap: 'bg-rose-50 text-rose-700',
                  confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
              };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
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
                        id="confirm-modal-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                    >
                        {config.title}
                    </h2>

                    {/* Booking summary */}
                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Calendar style={{ width: 16, height: 16 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {booking.service?.title ?? 'Tempahan'}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                {getCustomerName(booking)} ·{' '}
                                {formatDate(booking.preferred_date)}
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