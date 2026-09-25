import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

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
    Sparkle: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3l1.5 4.5L16 9l-4.5 1.5L10 15l-1.5-4.5L4 9l4.5-1.5L10 3z" />
        </svg>
    ),
};

/* 🆕 FIX: statuses use 'requested' (matches your controller), not 'pending' */
const statusStyles = {
    requested: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted:  'bg-sky-50 text-sky-700 border-sky-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusLabels = {
    requested: 'Menunggu',
    accepted:  'Diterima',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
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

const stripHtml = (html) => {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').trim();
};

/* 🆕 FIX: reads from provider_profile (matches what the controller loads) */
const getProviderName = (booking) =>
    booking.provider_profile?.business_name ??
    booking.provider_profile?.user?.name ??
    'Tukang';

/* ---------- Status pill ---------- */
function StatusPill({ status }) {
    const s = statusStyles[status] ?? statusStyles.requested;
    const label = statusLabels[status] ?? status;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s}`}
        >
            {status === 'requested' && <Icon.Clock style={{ width: 10, height: 10 }} />}
            {status === 'accepted'  && <Icon.Check style={{ width: 10, height: 10 }} />}
            {status === 'completed' && <Icon.Check style={{ width: 10, height: 10 }} />}
            {status === 'cancelled' && <Icon.X     style={{ width: 10, height: 10 }} />}
            {label}
        </span>
    );
}

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, tone = 'emerald' }) {
    const tones = {
        emerald: 'text-emerald-700',
        amber:   'text-amber-700',
        sky:     'text-sky-700',
        rose:    'text-rose-700',
    };

    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-md">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {label}
            </p>
            <p className={`mt-2 font-serif text-3xl tracking-tight ${tones[tone]}`}>
                {value}
            </p>
            {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
        </div>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ bookings = [] }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [cancellingBooking, setCancellingBooking] = useState(null);

    /* 🆕 FIX: tolerate plain array OR paginator */
    const rows = Array.isArray(bookings) ? bookings : (bookings?.data ?? []);

    const filtered = useMemo(() => {
        return rows.filter((b) => {
            const matchesQuery =
                !query ||
                b.service?.title?.toLowerCase().includes(query.toLowerCase()) ||
                getProviderName(b).toLowerCase().includes(query.toLowerCase());

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
        cancelled: rows.filter((b) => b.status === 'cancelled').length,
    }), [rows]);

    /* ---------- Cancel flow ---------- */
    /* 🆕 FIX: plain path instead of route('bookings.cancel') */
    const confirmCancel = () => {
        if (!cancellingBooking) return;
        router.patch(
            `/customer/bookings/${cancellingBooking.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setCancellingBooking(null),
            }
        );
    };

    return (
        <MainLayout>
            <Head title="Tempahan saya — Tukang Perak" />

            {/* ============ HEADER ============ */}
            <section className="border-b border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                        <span className="h-px w-6 bg-emerald-700" />
                        TEMPAHAN SAYA
                    </p>

                    <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 sm:text-5xl">
                        Semua tempahan anda.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                        Lihat status tempahan, hubungi tukang, atau batalkan
                        tempahan jika perlu.
                    </p>

                    {/* Summary tiles */}
                    {rows.length > 0 && (
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard label="Jumlah"   value={counts.total}     hint="Semua tempahan"   tone="emerald" />
                            <StatCard label="Menunggu" value={counts.requested} hint="Belum disahkan"   tone="amber" />
                            <StatCard label="Diterima" value={counts.accepted}  hint="Sedang berjalan"  tone="sky" />
                            <StatCard label="Selesai"  value={counts.completed} hint="Kerja selesai"    tone="emerald" />
                        </div>
                    )}
                </div>
            </section>

            {/* ============ TOOLBAR + LIST ============ */}
            <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                {rows.length > 0 && (
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Icon.Search
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                                style={{ width: 16, height: 16 }}
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari perkhidmatan atau tukang..."
                                className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Icon.Filter className="text-stone-400" style={{ width: 16, height: 16 }} />
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    /* 🆕 FIX: 'requested' instead of 'pending' */
                                    { value: 'all',       label: 'Semua' },
                                    { value: 'requested', label: 'Menunggu' },
                                    { value: 'accepted',  label: 'Diterima' },
                                    { value: 'completed', label: 'Selesai' },
                                    { value: 'cancelled', label: 'Dibatalkan' },
                                ].map((tab) => {
                                    const active = statusFilter === tab.value;
                                    return (
                                        <button
                                            key={tab.value}
                                            type="button"
                                            onClick={() => setStatusFilter(tab.value)}
                                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                                active
                                                    ? 'border-emerald-700 bg-emerald-700 text-white'
                                                    : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:text-emerald-700'
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

                {/* Empty state — no bookings at all */}
                {rows.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Icon.Sparkle style={{ width: 24, height: 24 }} />
                        </span>
                        <h3 className="mt-4 font-serif text-2xl tracking-tight text-stone-900">
                            Belum ada tempahan
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                            Cari tukang untuk kerja di rumah anda, dan tempahan
                            pertama anda akan muncul di sini.
                        </p>
                        <Link
                            href="/browse"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                        >
                            <Icon.Search style={{ width: 14, height: 14 }} />
                            Cari tukang sekarang
                            <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                        </Link>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-500">
                            <Icon.Search style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="mt-3 text-sm font-semibold text-stone-800">
                            Tiada tempahan sepadan
                        </p>
                        <p className="mx-auto mt-1 max-w-xs text-xs text-stone-500">
                            Cuba tukar carian atau penapis status anda.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                        <ul className="divide-y divide-stone-200">
                            {filtered.map((booking) => (
                                <BookingRow
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={() => setCancellingBooking(booking)}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {cancellingBooking && (
                <ConfirmCancelModal
                    booking={cancellingBooking}
                    onCancel={() => setCancellingBooking(null)}
                    onConfirm={confirmCancel}
                />
            )}
        </MainLayout>
    );
}

/* ---------- Booking row ---------- */
function BookingRow({ booking, onCancel }) {
    const status = booking.status ?? 'requested';

    /* 🆕 FIX: 'requested' is the cancellable state */
    const canCancel = status === 'requested';
    const providerName = getProviderName(booking);

    return (
        <li className="transition hover:bg-stone-50">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                {/* Provider avatar */}
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                    {booking.provider_profile?.photo_path ? (
                        /* 🆕 FIX: use provider_profile.photo_path */
                        <img
                            src={`/storage/${booking.provider_profile.photo_path}`}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        providerName.charAt(0).toUpperCase()
                    )}
                </span>

                {/* Details */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-stone-900">
                                {/* 🆕 FIX: service.title, not service_title */}
                                {booking.service?.title ?? 'Tempahan'}
                            </h3>
                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                {providerName}
                                {booking.district && ` · ${booking.district}`}
                            </p>
                        </div>
                        <StatusPill status={status} />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500">
                        {booking.preferred_date && (
                            <span className="inline-flex items-center gap-1.5">
                                <Icon.Calendar style={{ width: 12, height: 12 }} />
                                {formatDate(booking.preferred_date)}
                            </span>
                        )}
                        {/* 🆕 FIX: booking.price, not base_price */}
                        {booking.price != null && (
                            <span className="font-bold text-emerald-700">
                                {formatCurrency(booking.price)}
                            </span>
                        )}
                        {booking.created_at && (
                            <span className="inline-flex items-center gap-1.5">
                                <Icon.Clock style={{ width: 12, height: 12 }} />
                                Dihantar {formatDate(booking.created_at)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                    {/* 🆕 FIX: plain path instead of route('bookings.show') */}
                    <Link
                        href={`/customer/bookings/${booking.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                        Lihat
                        <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                    </Link>

                    {canCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                        >
                            <Icon.X style={{ width: 12, height: 12 }} />
                            Batal
                        </button>
                    )}
                </div>
            </div>
        </li>
    );
}

/* ---------- Cancel modal ---------- */
function ConfirmCancelModal({ booking, onCancel, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                        <Icon.Alert style={{ width: 26, height: 26 }} />
                    </div>

                    <h2
                        id="cancel-modal-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-stone-900"
                    >
                        Batalkan tempahan ini?
                    </h2>

                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                            <Icon.Wrench style={{ width: 16, height: 16 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-stone-800">
                                {booking.service?.title ?? 'Tempahan'}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                {getProviderName(booking)}
                                {booking.preferred_date &&
                                    ` · ${formatDate(booking.preferred_date)}`}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-stone-600">
                        Tempahan ini akan dibatalkan. Anda perlu membuat
                        tempahan baru jika ingin meneruskan.
                    </p>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 sm:flex-1"
                        >
                            Tidak, kekalkan
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 sm:flex-1"
                        >
                            Ya, batalkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}