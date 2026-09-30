import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

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
    Users: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="7" cy="8" r="3" />
            <path d="M2 17c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
            <path d="M13 6.5a3 3 0 110 6" />
            <path d="M14 17c0-1.9-.6-3.2-1.6-4.1 2.6-.3 5 1.3 5 4.1" />
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
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
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

/* ---------- Helpers ---------- */
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
function StatusPill({ status }) {
    const config = statusConfig[status] ?? statusConfig.active;
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
export default function Index({ customers }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    /* Suspend modal state */
    const [suspendTarget, setSuspendTarget] = useState(null);
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const rows = Array.isArray(customers) ? customers : customers.data ?? [];

    /* Client-side search + status filter */
    const filtered = useMemo(() => {
        return rows.filter((c) => {
            const q = query.toLowerCase();
            const matchesQuery =
                !query ||
                c.name?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === 'all' || getStatus(c) === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [rows, query, statusFilter]);

    const counts = useMemo(
        () => ({
            total: rows.length,
            active: rows.filter((c) => getStatus(c) === 'active').length,
            suspended: rows.filter((c) => getStatus(c) === 'suspended').length,
        }),
        [rows]
    );

    const closeSuspendModal = () => {
        if (processing) return;
        setSuspendTarget(null);
        setReason('');
    };

    const handleSuspend = () => {
        if (!suspendTarget) return;
        setProcessing(true);
        router.patch(
            route('admin.customers.suspend', suspendTarget.id),
            { suspension_reason: reason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(false);
                    setSuspendTarget(null);
                    setReason('');
                },
            }
        );
    };

    const handleUnsuspend = (customerId) => {
        setProcessing(true);
        router.patch(
            route('admin.customers.unsuspend', customerId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AdminLayout title="Pelanggan" breadcrumb="Pengurusan / Pelanggan">
            <Head title="Pelanggan — Admin Tukang Perak" />

            {/* ============ HEADER ============ */}
            <div className="admin-page-header">
                <p className="eyebrow">PENGURUSAN</p>
                <h1 className="admin-page-heading mt-3">
                    Urus pelanggan platform.
                </h1>
                <p className="admin-page-subtitle">
                    Semak akaun pelanggan, pantau aktiviti tempahan, dan gantung
                    akaun jika perlu.
                </p>
            </div>

            {/* ============ STAT TILES ============ */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        label="Jumlah pelanggan"
                        value={counts.total}
                        hint="Berdaftar di platform"
                        icon={Icon.Users}
                        accent="ink"
                    />
                    <StatCard
                        label="Aktif"
                        value={counts.active}
                        hint="Boleh menempah"
                        icon={Icon.Check}
                        accent="green"
                    />
                    <StatCard
                        label="Digantung"
                        value={counts.suspended}
                        hint="Akses dihadkan"
                        icon={Icon.Ban}
                        accent="rose"
                    />
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
                            placeholder="Cari nama atau e-mel..."
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* Status filter tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Icon.Filter
                            className="text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { value: 'all',       label: 'Semua' },
                                { value: 'active',    label: 'Aktif' },
                                { value: 'suspended', label: 'Digantung' },
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
                <div className="admin-card">
                    <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Inbox style={{ width: 28, height: 28 }} />
                        </span>
                        <h2 className="font-serif text-2xl tracking-tight text-[color:var(--ink)]">
                            Belum ada pelanggan
                        </h2>
                        <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                            Akaun pelanggan akan muncul di sini apabila mereka
                            mendaftar.
                        </p>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-card">
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--paper)] text-[color:var(--muted)]">
                            <Icon.Search style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Tiada pelanggan sepadan
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Cuba tukar carian atau penapis status anda.
                        </p>
                    </div>
                </div>
            ) : (
                /* ============ CUSTOMER CARDS ============ */
                <div className="flex flex-col gap-4">
                    {filtered.map((customer) => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onSuspend={() => setSuspendTarget(customer)}
                            onUnsuspend={() => handleUnsuspend(customer.id)}
                            processing={processing}
                        />
                    ))}
                </div>
            )}

            {/* ============ PAGINATION ============ */}
            {customers?.links && customers.links.length > 3 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                    {customers.links.map((link, i) => {
                        const label = link.label
                            .replace('&laquo;', '«')
                            .replace('&raquo;', '»')
                            .replace(/<[^>]*>/g, '');

                        if (!link.url) {
                            return (
                                <span
                                    key={i}
                                    className="inline-flex items-center rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--muted)] opacity-50"
                                >
                                    {label}
                                </span>
                            );
                        }

                        return (
                            <a
                                key={i}
                                href={link.url}
                                className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                                    link.active
                                        ? 'border-[color:var(--green)] bg-[color:var(--green)] text-white'
                                        : 'border-[color:var(--line)] bg-white text-[color:var(--muted)] hover:border-[#a9cdb4] hover:text-[color:var(--green)]'
                                }`}
                            >
                                {label}
                            </a>
                        );
                    })}
                </div>
            )}

            {/* ============ SUSPEND MODAL ============ */}
            {suspendTarget && (
                <SuspendModal
                    customer={suspendTarget}
                    reason={reason}
                    setReason={setReason}
                    processing={processing}
                    onCancel={closeSuspendModal}
                    onConfirm={handleSuspend}
                />
            )}
        </AdminLayout>
    );
}

/* ============================ CUSTOMER CARD ============================ */
function CustomerCard({ customer, onSuspend, onUnsuspend, processing }) {
    const status = getStatus(customer);
    const isSuspended = status === 'suspended';

    return (
        <article className="admin-card overflow-hidden">
            {/* Clickable header — navigates to customer detail */}
            <Link
                href={route('admin.customers.show', customer.id)}
                className="group block p-5 transition hover:bg-[color:var(--paper)]/40 sm:p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--lime)] text-base font-bold text-[color:var(--green-dark)]">
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
                            <h3 className="truncate text-base font-bold text-[color:var(--ink)] transition group-hover:text-[color:var(--green)]">
                                {customer.name}
                            </h3>
                            <p className="mt-0.5 truncate text-sm text-[color:var(--muted)]">
                                {customer.email}
                            </p>
                        </div>
                    </div>

                    <StatusPill status={status} />
                </div>

                {/* Meta row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--line)] pt-4 text-xs text-[color:var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                        <Icon.Calendar style={{ width: 12, height: 12 }} />
                        {customer.bookings_count ?? 0} tempahan
                    </span>
                    {customer.phone_number && (
                        <span className="inline-flex items-center gap-1.5">
                            <Icon.Phone style={{ width: 12, height: 12 }} />
                            {customer.phone_number}
                        </span>
                    )}
                    {customer.created_at && (
                        <span className="inline-flex items-center gap-1.5">
                            <Icon.Clock style={{ width: 12, height: 12 }} />
                            Sertai {new Date(customer.created_at).toLocaleDateString('ms-MY', {
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    )}
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[color:var(--green)] transition group-hover:translate-x-0.5">
                    Lihat butiran penuh
                    <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                </div>
            </Link>

            {/* Action footer — Suspend / Unsuspend */}
            <div className="flex flex-col gap-3 border-t border-[color:var(--line)] bg-[color:var(--paper)]/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-end">
                {isSuspended ? (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onUnsuspend}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[color:var(--green)] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Icon.Check style={{ width: 12, height: 12 }} />
                        Buka semula akaun
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onSuspend}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Icon.Ban style={{ width: 12, height: 12 }} />
                        Gantung akaun
                    </button>
                )}
            </div>
        </article>
    );
}

/* ============================ SUSPEND MODAL ============================ */
function SuspendModal({ customer, reason, setReason, processing, onCancel, onConfirm }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="suspend-modal-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
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

                    {/* Customer summary */}
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
                        Pelanggan tidak akan dapat menempah atau berkomunikasi
                        sehingga akaun dibuka semula.
                    </p>

                    {/* Reason */}
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
                            onClick={onCancel}
                            disabled={processing}
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                        >
                            Tidak, kembali
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
    );
}