import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
    Users: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="7" cy="8" r="3" />
            <path d="M2 17c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
            <path d="M13 6.5a3 3 0 110 6" />
            <path d="M14 17c0-1.9-.6-3.2-1.6-4.1 2.6-.3 5 1.3 5 4.1" />
        </svg>
    ),
    Ban: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M5 5l10 10" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
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
const customerStatusConfig = {
    active: {
        label: 'Aktif',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: Icon.Check,
    },
    suspended: {
        label: 'Digantung',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
        icon: Icon.Ban,
    },
};

const bookingStatusConfig = {
    requested: {
        label: 'Menunggu',
        cls: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    accepted: {
        label: 'Diterima',
        cls: 'border-sky-200 bg-sky-50 text-sky-700',
    },
    work_done: {
        label: 'Kerja siap',
        cls: 'border-violet-200 bg-violet-50 text-violet-700',
    },
    completed: {
        label: 'Selesai',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    declined: {
        label: 'Ditolak',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
    },
    cancelled: {
        label: 'Dibatalkan',
        cls: 'border-stone-200 bg-stone-100 text-stone-600',
    },
    disputed: {
        label: 'Pertikaian',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
    },
};

/* ---------- Helpers ---------- */
const formatDate = (date, style = 'long') => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: style === 'short' ? 'short' : 'long',
        year: 'numeric',
    });
};

const getInitial = (customer) =>
    (customer?.name ?? 'P').charAt(0).toUpperCase();

const getStatus = (customer) => customer.status ?? 'active';

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, icon: Ico, accent = 'green' }) {
    const accentMap = {
        green: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber: 'bg-amber-50 text-amber-700',
        sky:   'bg-sky-50 text-sky-700',
        rose:  'bg-rose-50 text-rose-700',
        ink:   'bg-[color:var(--warm)] text-[color:var(--ink)]',
    };
    return (
        <div className="admin-stat">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="admin-stat__label">{label}</p>
                    <p className="admin-stat__value">{value}</p>
                    {hint && (
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            {hint}
                        </p>
                    )}
                </div>
                {Ico && (
                    <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accentMap[accent]}`}
                    >
                        <Ico style={{ width: 18, height: 18 }} />
                    </span>
                )}
            </div>
        </div>
    );
}

/* ---------- Status pill ---------- */
function StatusPill({ status, type = 'customer' }) {
    const config =
        type === 'customer'
            ? customerStatusConfig[status] ?? customerStatusConfig.active
            : bookingStatusConfig[status] ?? bookingStatusConfig.requested;

    const StatusIcon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.cls}`}
        >
            {StatusIcon && <StatusIcon style={{ width: 10, height: 10 }} />}
            {config.label}
        </span>
    );
}

/* ---------- Detail row ---------- */
function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--paper)] text-[color:var(--muted)]">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                    {label}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-[color:var(--ink)]">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* ============================ PAGE ============================ */
export default function Show({ customer }) {
    const [suspendTarget, setSuspendTarget] = useState(false);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const status = getStatus(customer);
    const isSuspended = status === 'suspended';

    const closeSuspendModal = () => {
        if (processing) return;
        setSuspendTarget(false);
        setReason('');
    };

    const handleSuspend = () => {
        if (!reason.trim()) return;
        setProcessing(true);
        router.patch(
            route('admin.customers.suspend', customer.id),
            { suspension_reason: reason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setSuspendTarget(false);
                    setReason('');
                },
            }
        );
    };

    const handleUnsuspend = () => {
        setProcessing(true);
        router.patch(
            route('admin.customers.unsuspend', customer.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AdminLayout title={customer.name} breadcrumb="Pengurusan / Pelanggan">
            <Head title={`${customer.name} — Admin Tukang Perak`} />

            {/* Back link */}
            <Link
                href={route('admin.customers.index')}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
            >
                <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                Kembali ke senarai pelanggan
            </Link>

            {/* ============ SUSPENDED BANNER ============ */}
            {isSuspended && (
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                    <div className="flex items-start gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                            <Icon.Ban style={{ width: 18, height: 18 }} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-rose-900">
                                Akaun ini telah digantung
                            </p>
                            <p className="mt-1 text-sm leading-6 text-rose-800/90">
                                Pelanggan tidak boleh menempah atau berkomunikasi
                                sehingga akaun dibuka semula.
                            </p>

                            {customer.suspension_reason && (
                                <div className="mt-3 rounded-lg border border-rose-200 bg-white/70 p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-rose-600">
                                        Sebab penggantungan
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-rose-900">
                                        {customer.suspension_reason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={processing}
                        onClick={handleUnsuspend}
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-[color:var(--green)] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                    >
                        <Icon.Check style={{ width: 14, height: 14 }} />
                        Buka semula akaun
                    </button>
                </div>
            )}

            {/* ============ HERO CARD ============ */}
            <div className="admin-card overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--lime)] text-xl font-bold text-[color:var(--green-dark)]">
                                {customer.avatar_url ? (
                                    <img
                                        src={customer.avatar_url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    getInitial(customer)
                                )}
                            </span>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--green)]">
                                    PELANGGAN
                                </p>
                                <h1 className="mt-1.5 font-serif text-2xl tracking-tight text-[color:var(--ink)] sm:text-3xl">
                                    {customer.name}
                                </h1>
                                <p className="mt-1 text-sm text-[color:var(--muted)]">
                                    {customer.email}
                                </p>

                                <div className="mt-3">
                                    <StatusPill status={status} />
                                </div>
                            </div>
                        </div>

                        {/* Suspend button */}
                        {!isSuspended && (
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => setSuspendTarget(true)}
                                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                            >
                                <Icon.Ban style={{ width: 14, height: 14 }} />
                                Gantung akaun
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ============ STAT TILES ============ */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    label="Jumlah tempahan"
                    value={customer.bookings_count ?? 0}
                    hint="Sepanjang masa"
                    icon={Icon.Calendar}
                    accent="green"
                />
                <StatCard
                    label="Sertai platform"
                    value={formatDate(customer.created_at, 'short')}
                    hint="Tarikh pendaftaran"
                    icon={Icon.Clock}
                    accent="ink"
                />
                <StatCard
                    label="Status akaun"
                    value={isSuspended ? 'Digantung' : 'Aktif'}
                    hint={
                        isSuspended
                            ? 'Akses dihadkan'
                            : 'Boleh menempah perkhidmatan'
                    }
                    icon={isSuspended ? Icon.Ban : Icon.Check}
                    accent={isSuspended ? 'rose' : 'green'}
                />
            </section>

            {/* ============ MAIN GRID ============ */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* LEFT: booking history */}
                <div className="flex flex-col gap-6">
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <div>
                                <h2 className="admin-card__title">
                                    Sejarah tempahan
                                </h2>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    {customer.bookings?.length ?? 0} tempahan direkodkan
                                </p>
                            </div>
                        </div>

                        <div className="admin-card__body !py-2">
                            {!customer.bookings || customer.bookings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                        <Icon.Inbox style={{ width: 20, height: 20 }} />
                                    </span>
                                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                                        Belum ada tempahan
                                    </p>
                                    <p className="max-w-xs text-xs text-[color:var(--muted)]">
                                        Pelanggan ini belum membuat sebarang
                                        tempahan.
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-[color:var(--line)]">
                                    {customer.bookings.map((booking) => (
                                        <li key={booking.id}>
                                            <Link
                                                href={route(
                                                    'admin.bookings.show',
                                                    booking.id
                                                )}
                                                className="group flex items-start gap-4 px-1 py-3.5 transition hover:bg-[color:var(--paper)]/40"
                                            >
                                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--paper)] text-[color:var(--muted)]">
                                                    <Icon.Wrench
                                                        style={{
                                                            width: 16,
                                                            height: 16,
                                                        }}
                                                    />
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[color:var(--ink)] transition group-hover:text-[color:var(--green-dark)]">
                                                                {booking.service
                                                                    ?.title ??
                                                                    'Perkhidmatan'}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                                                #{booking.providerProfile?.user?.name &&
                                                            ` · ${booking.providerProfile.user.name}`}
                                                            </p>
                                                        </div>

                                                        <StatusPill
                                                            status={booking.status}
                                                            type="booking"
                                                        />
                                                    </div>

                                                    <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                                                        <span className="inline-flex items-center gap-1">
                                                            <Icon.Calendar
                                                                style={{
                                                                    width: 12,
                                                                    height: 12,
                                                                }}
                                                            />
                                                            {formatDate(
                                                                booking.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Icon.ArrowRight
                                                    className="mt-3 shrink-0 text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                                                    style={{ width: 16, height: 16 }}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: contact info */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                    <div className="admin-card p-5">
                        <h3 className="text-sm font-bold text-[color:var(--ink)]">
                            Maklumat hubungan
                        </h3>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            Untuk urusan berkaitan akaun ini
                        </p>

                        <div className="mt-4 flex flex-col gap-2">
                            {customer.email && (
                                <a
                                    href={`mailto:${customer.email}`}
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
                                            {customer.email}
                                        </span>
                                    </span>
                                </a>
                            )}

                            {customer.phone_number && (
                                <a
                                    href={`tel:${customer.phone_number}`}
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
                                            {customer.phone_number}
                                        </span>
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Account details */}
                    <div className="admin-card p-5">
                        <h3 className="text-sm font-bold text-[color:var(--ink)]">
                            Maklumat akaun
                        </h3>

                        <div className="mt-4 flex flex-col gap-4">
                            <DetailRow
                                icon={<Icon.Users style={{ width: 13, height: 13 }} />}
                                label="Peranan"
                                value="Pelanggan"
                            />
                            <DetailRow
                                icon={<Icon.Calendar style={{ width: 13, height: 13 }} />}
                                label="Tarikh sertai"
                                value={formatDate(customer.created_at)}
                            />
                            <DetailRow
                                icon={
                                    isSuspended
                                        ? <Icon.Ban style={{ width: 13, height: 13 }} />
                                        : <Icon.Check style={{ width: 13, height: 13 }} />
                                }
                                label="Status"
                                value={isSuspended ? 'Digantung' : 'Aktif'}
                            />
                        </div>
                    </div>
                </aside>
            </div>

            {/* ============ SUSPEND MODAL ============ */}
            {suspendTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="suspend-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={closeSuspendModal}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                                <Icon.Ban style={{ width: 26, height: 26 }} />
                            </div>

                            <h2
                                id="suspend-modal-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                            >
                                Gantung akaun ini?
                            </h2>

                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                                    <Icon.Users style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                        {customer.name}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                        {customer.email}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                                Pelanggan tidak akan dapat menempah atau
                                berkomunikasi sehingga akaun dibuka semula.
                            </p>

                            <div className="mt-4">
                                <label
                                    htmlFor="suspend-reason"
                                    className="block text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]"
                                >
                                    Sebab penggantungan
                                </label>
                                <textarea
                                    id="suspend-reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                    placeholder="Contoh: Menyalahgunakan platform atau melanggar terma perkhidmatan."
                                    className="mt-1.5 w-full resize-none rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                />
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={closeSuspendModal}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, kembali
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSuspend}
                                    disabled={processing || !reason.trim()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menggantung...
                                        </>
                                    ) : (
                                        'Ya, gantung'
                                    )}
                                </button>
                            </div>

                            <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-[color:var(--muted)]">
                                Tekan ESC untuk batal
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}