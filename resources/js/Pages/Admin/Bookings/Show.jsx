import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
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
};

/* ---------- Status config ---------- */
const statusMap = {
    requested: {
        label: 'Menunggu pengesahan',
        cls: 'border-amber-200 bg-amber-50 text-amber-800',
        icon: Icon.Clock,
        hint: 'Tukang belum mengesahkan tempahan ini.',
    },
    accepted: {
        label: 'Diterima',
        cls: 'border-sky-200 bg-sky-50 text-sky-800',
        icon: Icon.Check,
        hint: 'Tukang telah menerima tempahan ini.',
    },
    declined: {
        label: 'Ditolak',
        cls: 'border-rose-200 bg-rose-50 text-rose-800',
        icon: Icon.X,
        hint: 'Tukang telah menolak tempahan ini.',
    },
    completed: {
        label: 'Selesai',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        icon: Icon.Check,
        hint: 'Kerja telah diselesaikan.',
    },
    cancelled: {
        label: 'Dibatalkan',
        cls: 'border-stone-200 bg-stone-100 text-stone-700',
        icon: Icon.X,
        hint: 'Tempahan ini telah dibatalkan.',
    },
};

/* ---------- Static label maps ---------- */
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
        month: 'long',
        year: 'numeric',
    });
};

const formatDateTime = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getCustomerName = (b) =>
    b.customer?.name ?? b.customer_name ?? 'Pelanggan';

const getCustomerInitial = (b) =>
    getCustomerName(b).charAt(0).toUpperCase();

const getProviderName = (b) =>
    b.provider_profile?.business_name ??
    b.provider_profile?.user?.name ??
    b.provider_name ??
    'Tukang';

const getProviderInitial = (b) =>
    getProviderName(b).charAt(0).toUpperCase();

const getServiceTitle = (b) =>
    b.service?.title ?? b.service_title ?? 'Perkhidmatan';

/* ---------- Status banner ---------- */
function StatusBanner({ status }) {
    const config = statusMap[status] ?? statusMap.requested;
    const StatusIcon = config.icon;

    return (
        <div className={`flex items-start gap-4 rounded-2xl border p-4 sm:p-5 ${config.cls}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/60">
                <StatusIcon style={{ width: 18, height: 18 }} />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{config.label}</p>
                <p className="mt-0.5 text-xs leading-5 opacity-90">{config.hint}</p>
            </div>
        </div>
    );
}

/* ============================ PAGE ============================ */
export default function Show({ booking }) {
    const customerName = getCustomerName(booking);
    const providerName = getProviderName(booking);

    return (
        <AdminLayout title="Butiran tempahan" breadcrumb="Tempahan">
            <Head title={`Tempahan #${booking.id} — Admin Tukang Perak`} />

            {/* ---------- Back link ---------- */}
            <Link
                href="/admin/bookings"
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
            >
                <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                Kembali ke senarai tempahan
            </Link>

            {/* ---------- Status banner ---------- */}
            <StatusBanner status={booking.status} />

            {/* ============ HERO CARD ============ */}
            <div className="admin-card mt-6 overflow-hidden">
                <div className="p-5 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[color:var(--green)]">
                                <span className="h-px w-5 bg-[color:var(--green)]" />
                                TEMPAHAN #{booking.id}
                            </p>
                            <h1 className="mt-2 font-serif text-2xl tracking-tight text-[color:var(--ink)] sm:text-3xl">
                                {getServiceTitle(booking)}
                            </h1>
                            <p className="mt-1 text-sm text-[color:var(--muted)]">
                                antara{' '}
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {customerName}
                                </span>{' '}
                                dan{' '}
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {providerName}
                                </span>
                            </p>
                        </div>

                        {/* Price badge */}
                        {booking.price != null && (
                            <div className="shrink-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">
                                    Harga
                                </p>
                                <p className="mt-1 font-serif text-2xl tracking-tight text-[color:var(--green-dark)]">
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
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Butiran tempahan</h2>
                        </div>

                        <div className="admin-card__body">
                            <dl className="grid gap-5 sm:grid-cols-2">
                                <DetailItem
                                    icon={<Icon.Calendar style={{ width: 14, height: 14 }} />}
                                    label="Tarikh pilihan"
                                    value={formatDate(booking.preferred_date)}
                                />
                                <DetailItem
                                    icon={<Icon.Pin style={{ width: 14, height: 14 }} />}
                                    label="Daerah"
                                    value={
                                        districtLabels[booking.district] ??
                                        booking.district ??
                                        '—'
                                    }
                                />
                                <div className="sm:col-span-2">
                                    <DetailItem
                                        icon={<Icon.Pin style={{ width: 14, height: 14 }} />}
                                        label="Alamat penuh"
                                        value={booking.address ?? '—'}
                                        multiline
                                    />
                                </div>
                                {booking.notes && (
                                    <div className="sm:col-span-2">
                                        <DetailItem
                                            icon={<Icon.Info style={{ width: 14, height: 14 }} />}
                                            label="Nota pelanggan"
                                            value={booking.notes}
                                            multiline
                                        />
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* ---------- Service info ---------- */}
                    {booking.service && (
                        <div className="admin-card">
                            <div className="admin-card__header">
                                <h2 className="admin-card__title">Perkhidmatan</h2>
                            </div>

                            <div className="admin-card__body">
                                <div className="flex items-start gap-4">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                        <Icon.Wrench style={{ width: 18, height: 18 }} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-[color:var(--ink)]">
                                            {booking.service.title}
                                        </p>
                                        {booking.service.description && (
                                            <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
                                                {booking.service.description}
                                            </p>
                                        )}
                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                            {booking.service.base_price != null && (
                                                <span className="font-bold text-[color:var(--green-dark)]">
                                                    {formatCurrency(booking.service.base_price)}
                                                </span>
                                            )}
                                            {booking.service.price_type && (
                                                <span className="rounded-md bg-[color:var(--paper)] px-2 py-0.5 font-semibold text-[color:var(--muted)]">
                                                    {booking.service.price_type === 'hourly'
                                                        ? 'Mengikut jam'
                                                        : 'Harga tetap'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ---------- Timeline ---------- */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Rekod masa</h2>
                        </div>

                        <div className="admin-card__body">
                            <dl className="grid gap-5 sm:grid-cols-2">
                                <DetailItem
                                    icon={<Icon.Clock style={{ width: 14, height: 14 }} />}
                                    label="Dihantar"
                                    value={formatDateTime(booking.created_at)}
                                />
                                <DetailItem
                                    icon={<Icon.Clock style={{ width: 14, height: 14 }} />}
                                    label="Dikemas kini"
                                    value={formatDateTime(booking.updated_at)}
                                />
                            </dl>
                        </div>
                    </div>
                </div>

                {/* RIGHT: parties */}
                <aside className="flex flex-col gap-6">
                    {/* Customer card */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Pelanggan</h2>
                        </div>

                        <div className="admin-card__body">
                            <div className="flex items-start gap-3">
                                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-base font-bold text-[color:var(--green-dark)]">
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
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-[color:var(--ink)]">
                                        {customerName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                        {booking.customer?.email ?? '—'}
                                    </p>
                                </div>
                            </div>

                            {booking.customer?.phone_number && (
                                <a
                                    href={`tel:${booking.customer.phone_number}`}
                                    className="mt-4 flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                >
                                    <Icon.Phone style={{ width: 14, height: 14 }} />
                                    {booking.customer.phone_number}
                                </a>
                            )}

                            {booking.customer?.id && (
                                <Link
                                    href={`/admin/customers/${booking.customer.id}`}
                                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                >
                                    Lihat profil pelanggan
                                    <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Provider card */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Tukang</h2>
                        </div>

                        <div className="admin-card__body">
                            <div className="flex items-start gap-3">
                                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-base font-bold text-[color:var(--green-dark)]">
                                    {booking.provider_profile?.photo_path ? (
                                        <img
                                            src={`/storage/${booking.provider_profile.photo_path}`}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getProviderInitial(booking)
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-[color:var(--ink)]">
                                        {providerName}
                                    </p>
                                    {booking.provider_profile?.user?.name &&
                                        booking.provider_profile.user.name !==
                                            booking.provider_profile.business_name && (
                                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                                {booking.provider_profile.user.name}
                                            </p>
                                        )}
                                </div>
                            </div>

                            {booking.provider_profile?.user?.phone_number && (
                                <a
                                    href={`tel:${booking.provider_profile.user.phone_number}`}
                                    className="mt-4 flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                >
                                    <Icon.Phone style={{ width: 14, height: 14 }} />
                                    {booking.provider_profile.user.phone_number}
                                </a>
                            )}

                            {booking.provider_profile?.id && (
                                <Link
                                    href={`/admin/providers/${booking.provider_profile.id}`}
                                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                >
                                    Lihat profil tukang
                                    <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Admin info card */}
                    <div className="admin-card">
                        <div className="admin-card__body">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--paper)] text-[color:var(--muted)]">
                                    <Icon.Shield style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[color:var(--ink)]">
                                        Paparan admin
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                                        Halaman ini hanya untuk rujukan. Untuk
                                        pertikaian atau bantuan, hubungi kedua-dua
                                        pihak di atas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
}

/* ---------- Detail item helper ---------- */
function DetailItem({ icon, label, value, multiline = false }) {
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