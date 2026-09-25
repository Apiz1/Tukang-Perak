import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Money: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="2.5" y="6" width="15" height="9" rx="2" />
            <circle cx="10" cy="10.5" r="2" />
            <path d="M5 6v9M15 6v9" />
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
        label: 'Menunggu pengesahan',
        cls: 'border-amber-200 bg-amber-50 text-amber-800',
        icon: Icon.Clock,
        hint: 'Tukang akan mengesahkan tidak lama lagi.',
    },
    accepted: {
        label: 'Diterima',
        cls: 'border-sky-200 bg-sky-50 text-sky-800',
        icon: Icon.Check,
        hint: 'Tukang telah menerima tempahan anda.',
    },
    in_progress: {
        label: 'Sedang berjalan',
        cls: 'border-sky-200 bg-sky-50 text-sky-800',
        icon: Icon.Clock,
        hint: 'Kerja sedang dijalankan.',
    },
    completed: {
        label: 'Selesai',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        icon: Icon.Check,
        hint: 'Kerja telah selesai.',
    },
    cancelled: {
        label: 'Dibatalkan',
        cls: 'border-rose-200 bg-rose-50 text-rose-800',
        icon: Icon.X,
        hint: 'Tempahan ini telah dibatalkan.',
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

const getProviderName = (booking) =>
    booking.provider_profile?.business_name ??
    booking.provider_profile?.user?.name ??
    'Tukang';

const getProviderPhoto = (booking) =>
    booking.provider_profile?.photo_path
        ? `/storage/${booking.provider_profile.photo_path}`
        : null;

const getProviderInitial = (booking) =>
    getProviderName(booking).charAt(0).toUpperCase();

/* ---------- Status banner ---------- */
function StatusBanner({ status }) {
    const config = statusConfig[status] ?? statusConfig.requested;
    const StatusIcon = config.icon;

    return (
        <div className={`flex items-start gap-4 rounded-2xl border p-4 sm:p-5 ${config.cls}`}>
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
    );
}

/* ============================ PAGE ============================ */
export default function Show({ booking }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const providerName = getProviderName(booking);
    const providerPhoto = getProviderPhoto(booking);
    const canCancel = booking.status === 'requested';

    const handleCancel = () => {
        setCancelling(true);
        router.patch(
            route('customer.bookings.cancel', booking.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setCancelling(false);
                    setShowCancelModal(false);
                },
            }
        );
    };

    return (
        <MainLayout>
            <Head title={`Tempahan ${booking.service?.title ?? ''} — Tukang Perak`} />

            <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
                {/* Back link */}
                <Link
                    href={route('customer.bookings.index')}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
                >
                    <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                    Kembali ke tempahan saya
                </Link>

                {/* ============ STATUS BANNER ============ */}
                <StatusBanner status={booking.status} />

                {/* ============ HERO CARD ============ */}
                <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white">
                    <div className="px-5 py-6 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 items-start gap-4">
                                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                                    {providerPhoto ? (
                                        <img
                                            src={providerPhoto}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getProviderInitial(booking)
                                    )}
                                </span>

                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                        <span className="h-px w-5 bg-emerald-700" />
                                        TEMPAHAN
                                    </p>
                                    <h1 className="mt-1.5 font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl">
                                        {booking.service?.title ?? 'Tempahan'}
                                    </h1>
                                    <p className="mt-1 text-sm text-stone-600">
                                        oleh{' '}
                                        <span className="font-semibold text-stone-800">
                                            {providerName}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Price badge */}
                            {booking.price != null && (
                                <div className="shrink-0 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                                        Harga
                                    </p>
                                    <p className="mt-1 font-serif text-2xl tracking-tight text-emerald-700">
                                        {formatCurrency(booking.price)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============ MAIN GRID ============ */}
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                    {/* LEFT: details */}
                    <div className="flex flex-col gap-6">
                        {/* ---------- Booking details ---------- */}
                        <div className="rounded-2xl border border-stone-200 bg-white">
                            <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                        <Icon.Calendar style={{ width: 16, height: 16 }} />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-bold text-stone-900">
                                            Butiran tempahan
                                        </h2>
                                        <p className="mt-0.5 text-xs text-stone-500">
                                            Apa yang anda isi semasa menempah
                                        </p>
                                    </div>
                                </div>
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
                                            icon={
                                                <Icon.Info
                                                    style={{ width: 14, height: 14 }}
                                                />
                                            }
                                            label="Nota anda"
                                            value={booking.notes}
                                            multiline
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ---------- Service card ---------- */}
                        {booking.service && (
                            <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                                <div className="flex items-start gap-4">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                                        <Icon.Wrench style={{ width: 16, height: 16 }} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                                            Perkhidmatan
                                        </p>
                                        <p className="mt-1 text-sm font-bold text-stone-900">
                                            {booking.service.title}
                                        </p>
                                        {booking.service.description && (
                                            <p className="mt-1 text-xs leading-5 text-stone-600">
                                                {booking.service.description}
                                            </p>
                                        )}
                                    </div>

                                    <Link
                                        href={`/providers/${booking.provider_profile?.id ?? ''}`}
                                        className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700 sm:inline-flex"
                                    >
                                        Lihat profil
                                        <Icon.ArrowRight
                                            style={{ width: 12, height: 12 }}
                                        />
                                    </Link>
                                </div>

                                {/* Mobile: view profile */}
                                <Link
                                    href={`/providers/${booking.provider_profile?.id ?? ''}`}
                                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700 sm:hidden"
                                >
                                    Lihat profil tukang
                                    <Icon.ArrowRight
                                        style={{ width: 12, height: 12 }}
                                    />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: sidebar */}
                    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                        {/* Contact card */}
                        {(booking.provider_profile?.user?.email ||
                            booking.provider_profile?.user?.phone_number) && (
                            <div className="rounded-2xl border border-stone-200 bg-white p-5">
                                <h3 className="text-sm font-bold text-stone-900">
                                    Hubungi tukang
                                </h3>
                                <p className="mt-1 text-xs text-stone-500">
                                    Untuk pertanyaan tentang tempahan ini
                                </p>

                                <div className="mt-4 flex flex-col gap-2">
                                    {booking.provider_profile.user.email && (
                                        <a
                                            href={`mailto:${booking.provider_profile.user.email}`}
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
                                                    {booking.provider_profile.user.email}
                                                </span>
                                            </span>
                                        </a>
                                    )}

                                    {booking.provider_profile.user.phone_number && (
                                        <a
                                            href={`tel:${booking.provider_profile.user.phone_number}`}
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
                                                    {booking.provider_profile.user
                                                        .phone_number}
                                                </span>
                                            </span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cancel card */}
                        {canCancel && (
                            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
                                <div className="flex items-start gap-3">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-700">
                                        <Icon.Alert
                                            style={{ width: 16, height: 16 }}
                                        />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-rose-900">
                                            Batalkan tempahan
                                        </p>
                                        <p className="mt-0.5 text-xs leading-5 text-rose-800/90">
                                            Jika anda tidak lagi memerlukan
                                            perkhidmatan ini, anda boleh
                                            membatalkannya sekarang.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowCancelModal(true)}
                                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                                        >
                                            <Icon.X style={{ width: 12, height: 12 }} />
                                            Batalkan tempahan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trust card */}
                        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                                    <Icon.Shield
                                        style={{ width: 16, height: 16 }}
                                    />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-stone-900">
                                        Komunikasi selamat
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-stone-600">
                                        Simpan semua perbualan melalui platform
                                        untuk rekod dan perlindungan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ============ CANCEL MODAL ============ */}
            {showCancelModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cancel-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !cancelling && setShowCancelModal(false)}
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
                                Batalkan tempahan?
                            </h2>

                            {/* Summary */}
                            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                <p className="text-xs font-semibold text-stone-700">
                                    {booking.service?.title ?? 'Tempahan'}
                                </p>
                                <p className="mt-0.5 text-xs text-stone-500">
                                    {providerName} ·{' '}
                                    {formatDate(booking.preferred_date)}
                                </p>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-stone-600">
                                Tempahan ini akan dibatalkan. Anda perlu membuat
                                tempahan baru jika ingin meneruskan.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={cancelling}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, kekalkan
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
                                >
                                    {cancelling ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Membatalkan...
                                        </>
                                    ) : (
                                        'Ya, batalkan'
                                    )}
                                </button>
                            </div>

                            <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-stone-500">
                                Tekan ESC untuk batal
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

/* ---------- Detail row helper ---------- */
function DetailRow({ icon, label, value, multiline = false }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-500">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    {label}
                </p>
                <p
                    className={`mt-0.5 text-sm font-semibold text-stone-800 ${
                        multiline ? 'whitespace-pre-line leading-6' : 'truncate'
                    }`}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}