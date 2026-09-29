import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

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
    Pin: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 18s6-5.5 6-10a6 6 0 10-12 0c0 4.5 6 10 6 10z" />
            <circle cx="10" cy="8" r="2.2" />
        </svg>
    ),
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Star: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    StarOutline: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Hourglass: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M6 3h8M6 17h8M7 3v3.5c0 1.5 3 2 3 3.5s-3 2-3 3.5V17M13 3v3.5c0 1.5-3 2-3 3.5s3 2 3 3.5V17" />
        </svg>
    ),
    Card: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="2.5" y="5" width="15" height="10" rx="2" />
            <path d="M2.5 9h15" />
        </svg>
    ),
};

/* ---------- Static label maps ---------- */
const districtLabels = {
    parit_buntar:  'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping:       'Taiping',
    ipoh:          'Ipoh',
    teluk_intan:   'Teluk Intan',
};

const statusConfig = {
    requested: {
        label: 'Menunggu',
        cls: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: Icon.Clock,
        hint: 'Semak butiran dan terima atau tolak tempahan ini.',
    },
    accepted: {
        label: 'Diterima',
        cls: 'border-sky-200 bg-sky-50 text-sky-700',
        icon: Icon.Check,
        hint: 'Tunggu bayaran pelanggan sebelum memulakan kerja.',
    },
    work_done: {
        label: 'Kerja siap',
        cls: 'border-violet-200 bg-violet-50 text-violet-700',
        icon: Icon.Hourglass,
        hint: 'Menunggu pelanggan mengesahkan kerja anda.',
    },
    completed: {
        label: 'Selesai',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: Icon.Check,
        hint: 'Kerja telah disahkan selesai oleh pelanggan.',
    },
    declined: {
        label: 'Ditolak',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
        icon: Icon.X,
        hint: 'Anda telah menolak tempahan ini.',
    },
    cancelled: {
        label: 'Dibatalkan',
        cls: 'border-stone-200 bg-stone-100 text-stone-600',
        icon: Icon.X,
        hint: 'Pelanggan telah membatalkan tempahan ini.',
    },
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
        month: 'long',
        year: 'numeric',
    });
};

const getCustomerName = (booking) =>
    booking.customer?.name ?? 'Pelanggan';

const getCustomerInitial = (booking) =>
    getCustomerName(booking).charAt(0).toUpperCase();

/* ---------- Detail row ---------- */
function DetailRow({ icon, label, value, multiline = false }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--paper)] text-[color:var(--muted)]">
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

/* ============================ PAGE ============================ */
export default function Show({ booking }) {
    const [processing, setProcessing] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    const status = booking.status ?? 'requested';
    const config = statusConfig[status] ?? statusConfig.requested;
    const StatusIcon = config.icon;

    const customerName = getCustomerName(booking);
    const paymentStatus = booking.payment?.status ?? null;
    const paymentHeld = paymentStatus === 'held';
    const isHourly = booking.service?.price_type === 'hourly';

    const canAccept = status === 'requested';
    const canDecline = status === 'requested';
    const canMarkWorkDone = status === 'accepted' && paymentHeld;

    const act = (url) => {
        setProcessing(true);
        router.patch(url, {}, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleAccept = () => act(route('provider.bookings.accept', booking.id));
    const handleMarkWorkDone = () => act(route('provider.bookings.mark-work-done', booking.id));
    const handleDecline = () => {
        setShowDeclineModal(false);
        act(route('provider.bookings.decline', booking.id));
    };

    return (
        <ProviderLayout
            title={`Tempahan #${booking.id}`}
            breadcrumb={`Tempahan / #${booking.id}`}
        >
            <Head title={`Tempahan #${booking.id} — Tukang Perak`} />

            {/* Back link */}
            <Link
                href={route('provider.bookings.index')}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
            >
                <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                Kembali ke tempahan
            </Link>

            {/* ============ STATUS BANNER ============ */}
            <div className={`mb-6 flex items-start gap-4 rounded-2xl border p-4 sm:p-5 ${config.cls}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/60">
                    <StatusIcon style={{ width: 18, height: 18 }} />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{config.label}</p>
                    <p className="mt-0.5 text-xs leading-5 opacity-90">
                        {config.hint}
                    </p>
                </div>
            </div>

            {/* ============ HERO CARD ============ */}
            <div className="provider-card overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--lime)] text-lg font-bold text-[color:var(--green-dark)]">
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
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--green)]">
                                    PELANGGAN
                                </p>
                                <h1 className="mt-1.5 font-serif text-2xl tracking-tight text-[color:var(--ink)]">
                                    {customerName}
                                </h1>
                                <p className="mt-1 text-sm text-[color:var(--muted)]">
                                    {booking.service?.title ?? 'Perkhidmatan'}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">
                                Harga
                            </p>
                            <p className="mt-1 font-serif text-2xl tracking-tight text-[color:var(--green-dark)]">
                                {formatCurrency(booking.price)}
                                {isHourly && (
                                    <span className="text-sm text-[color:var(--muted)]">
                                        {' '}/jam
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============ MAIN GRID ============ */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* LEFT */}
                <div className="flex flex-col gap-6">
                    {/* Job details */}
                    <div className="provider-card">
                        <div className="border-b border-[color:var(--line)] px-5 py-4 sm:px-6">
                            <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                Butiran kerja
                            </h2>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <DetailRow
                                icon={<Icon.Calendar style={{ width: 14, height: 14 }} />}
                                label="Tarikh pilihan"
                                value={formatDate(booking.preferred_date)}
                            />
                            <DetailRow
                                icon={<Icon.Pin style={{ width: 14, height: 14 }} />}
                                label="Daerah"
                                value={
                                    districtLabels[booking.district] ??
                                    booking.district ??
                                    '—'
                                }
                            />
                            <div className="sm:col-span-2">
                                <DetailRow
                                    icon={<Icon.Pin style={{ width: 14, height: 14 }} />}
                                    label="Alamat penuh"
                                    value={booking.address ?? '—'}
                                    multiline
                                />
                            </div>
                            {booking.notes && (
                                <div className="sm:col-span-2">
                                    <DetailRow
                                        icon={<Icon.Info style={{ width: 14, height: 14 }} />}
                                        label="Nota pelanggan"
                                        value={booking.notes}
                                        multiline
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment status card */}
                    <div className="provider-card p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                            <span
                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                                    paymentHeld
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                }`}
                            >
                                {paymentHeld ? (
                                    <Icon.Shield style={{ width: 16, height: 16 }} />
                                ) : (
                                    <Icon.Card style={{ width: 16, height: 16 }} />
                                )}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--muted)]">
                                    Status bayaran
                                </p>
                                <p className="mt-1 text-sm font-bold text-[color:var(--ink)] capitalize">
                                    {paymentHeld
                                        ? 'Disimpan dengan selamat'
                                        : paymentStatus ?? 'Belum dibayar'}
                                </p>
                                {paymentHeld && (
                                    <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                                        Wang pelanggan disimpan dengan selamat
                                        sehingga kerja ditandakan selesai.
                                    </p>
                                )}
                                {!paymentHeld && status === 'accepted' && (
                                    <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                                        Tunggu pelanggan membuat bayaran
                                        sebelum memulakan kerja.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer review (if present) */}
                    {booking.review && (
                        <div className="provider-card p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                    <Icon.Star style={{ width: 18, height: 18 }} />
                                </span>
                                <div>
                                    <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                        Ulasan pelanggan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Maklum balas tentang kerja ini
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                                    Penilaian
                                </p>
                                <div className="mt-1.5 flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <span
                                            key={n}
                                            className={
                                                n <= booking.review.rating
                                                    ? 'text-amber-500'
                                                    : 'text-stone-300'
                                            }
                                        >
                                            {n <= booking.review.rating ? (
                                                <Icon.Star style={{ width: 16, height: 16 }} />
                                            ) : (
                                                <Icon.StarOutline style={{ width: 16, height: 16 }} />
                                            )}
                                        </span>
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-[color:var(--ink)]">
                                        {booking.review.rating}/5
                                    </span>
                                </div>

                                {booking.review.comment ? (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[color:var(--ink)]">
                                        {booking.review.comment}
                                    </p>
                                ) : (
                                    <p className="mt-3 text-sm italic text-[color:var(--muted)]">
                                        Pelanggan tidak meninggalkan komen.
                                    </p>
                                )}

                                {booking.review.provider_reply && (
                                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                                        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                            <Icon.Check style={{ width: 11, height: 11 }} />
                                            Balasan anda
                                        </p>
                                        <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[color:var(--ink)]">
                                            {booking.review.provider_reply}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                    {/* Contact customer */}
                    {(booking.customer?.phone_number || booking.customer?.email) && (
                        <div className="provider-card p-5">
                            <h3 className="text-sm font-bold text-[color:var(--ink)]">
                                Hubungi pelanggan
                            </h3>
                            <p className="mt-1 text-xs text-[color:var(--muted)]">
                                Untuk aturan kerja ini
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                {booking.customer.phone_number && (
                                    <a
                                        href={`tel:${booking.customer.phone_number}`}
                                        className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:border-[#a9cdb4] hover:bg-[color:var(--paper)]"
                                    >
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                            <Icon.Phone style={{ width: 14, height: 14 }} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                                                Telefon
                                            </span>
                                            <span className="block truncate text-sm font-semibold text-[color:var(--ink)]">
                                                {booking.customer.phone_number}
                                            </span>
                                        </span>
                                    </a>
                                )}

                                {booking.customer.email && (
                                    <a
                                        href={`mailto:${booking.customer.email}`}
                                        className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:border-[#a9cdb4] hover:bg-[color:var(--paper)]"
                                    >
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                            <Icon.Mail style={{ width: 14, height: 14 }} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                                                E-mel
                                            </span>
                                            <span className="block truncate text-sm font-semibold text-[color:var(--ink)]">
                                                {booking.customer.email}
                                            </span>
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {(canAccept || canDecline || canMarkWorkDone || status === 'work_done') && (
                        <div className="provider-card p-5">
                            <h3 className="text-sm font-bold text-[color:var(--ink)]">
                                Tindakan
                            </h3>

                            <div className="mt-4 flex flex-col gap-2">
                                {canAccept && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={handleAccept}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--green)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Icon.Check style={{ width: 14, height: 14 }} />
                                        Terima tempahan
                                    </button>
                                )}

                                {canDecline && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={() => setShowDeclineModal(true)}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Icon.X style={{ width: 14, height: 14 }} />
                                        Tolak tempahan
                                    </button>
                                )}

                                {canMarkWorkDone && (
                                    <button
                                        type="button"
                                        disabled={processing}
                                        onClick={handleMarkWorkDone}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--green)] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Icon.Check style={{ width: 14, height: 14 }} />
                                        Tanda kerja siap
                                    </button>
                                )}

                                {status === 'accepted' && !paymentHeld && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                                        <Icon.Clock style={{ width: 14, height: 14 }} />
                                        Menunggu bayaran pelanggan
                                    </span>
                                )}

                                {status === 'work_done' && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-bold text-violet-700">
                                        <Icon.Hourglass style={{ width: 14, height: 14 }} />
                                        Menunggu pengesahan pelanggan
                                    </span>
                                )}

                                {status === 'completed' && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                        <Icon.Check style={{ width: 14, height: 14 }} />
                                        Kerja selesai
                                    </span>
                                )}

                                {status === 'declined' && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                                        <Icon.X style={{ width: 14, height: 14 }} />
                                        Anda menolak tempahan ini
                                    </span>
                                )}

                                {status === 'cancelled' && (
                                    <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600">
                                        <Icon.X style={{ width: 14, height: 14 }} />
                                        Dibatalkan oleh pelanggan
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Trust card */}
                    <div className="provider-card bg-[color:var(--paper)]/50 p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--green)] text-white">
                                <Icon.Shield style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-[color:var(--ink)]">
                                    Komunikasi selamat
                                </p>
                                <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                                    Simpan semua perbualan melalui platform
                                    untuk rekod dan perlindungan.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ============ DECLINE MODAL ============ */}
            {showDeclineModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="decline-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !processing && setShowDeclineModal(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                                <Icon.X style={{ width: 26, height: 26 }} />
                            </div>

                            <h2
                                id="decline-modal-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                            >
                                Tolak tempahan ini?
                            </h2>

                            <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                                <p className="text-xs font-semibold text-[color:var(--ink)]">
                                    {booking.service?.title ?? 'Tempahan'}
                                </p>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    {customerName} · {formatDate(booking.preferred_date)}
                                </p>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                                Pelanggan akan dimaklumkan bahawa tempahan ini
                                tidak dapat diterima. Tindakan ini tidak boleh
                                dibatalkan.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowDeclineModal(false)}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, kembali
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDecline}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menolak...
                                        </>
                                    ) : (
                                        'Ya, tolak'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    );
}