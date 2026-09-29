import { Head, router } from '@inertiajs/react';
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
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Undo: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10a6 6 0 1110 4.5M4 10V5M4 10h5" />
        </svg>
    ),
    Card: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="2.5" y="5" width="15" height="10" rx="2" />
            <path d="M2.5 9h15" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
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
    pending: {
        label: 'Menunggu bayaran',
        cls: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: Icon.Clock,
    },
    held: {
        label: 'Disimpan',
        cls: 'border-sky-200 bg-sky-50 text-sky-700',
        icon: Icon.Shield,
    },
    released: {
        label: 'Dilepaskan',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: Icon.Check,
    },
    disputed: {
        label: 'Pertikaian',
        cls: 'border-rose-200 bg-rose-50 text-rose-700',
        icon: Icon.Alert,
    },
    refunded: {
        label: 'Dipulangkan',
        cls: 'border-violet-200 bg-violet-50 text-violet-700',
        icon: Icon.Undo,
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
        month: 'short',
        year: 'numeric',
    });
};

const getCustomerName = (payment) =>
    payment.booking?.customer?.name ?? 'Pelanggan';

const getCustomerInitial = (payment) =>
    getCustomerName(payment).charAt(0).toUpperCase();

const getProviderName = (payment) =>
    payment.booking?.provider_profile?.business_name ??
    payment.booking?.provider_profile?.user?.name ??
    'Tukang';

const getServiceTitle = (payment) =>
    payment.booking?.service?.title ?? 'Perkhidmatan';

/* ---------- Status pill ---------- */
function StatusPill({ status }) {
    const config = statusConfig[status] ?? {
        label: status ?? '—',
        cls: 'border-stone-200 bg-stone-100 text-stone-600',
        icon: Icon.Card,
    };
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

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, icon: Ico, accent = 'green' }) {
    const accentMap = {
        green: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber: 'bg-amber-50 text-amber-700',
        sky: 'bg-sky-50 text-sky-700',
        rose: 'bg-rose-50 text-rose-700',
        violet: 'bg-violet-50 text-violet-700',
    };

    return (
        <div className="provider-stat">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="provider-stat__label">{label}</p>
                    <p className="provider-stat__value">{value}</p>
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

/* ============================ PAGE ============================ */
export default function Index({ payments, filters = {} }) {
    const [query, setQuery] = useState('');

    const rows = payments?.data ?? [];

    const applyFilter = (status) => {
        router.get(
            route('admin.payments.index'),
            status ? { status } : {},
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    /* Client-side search across customer, provider, service */
    const filtered = useMemo(() => {
        if (!query) return rows;
        const q = query.toLowerCase();
        return rows.filter(
            (p) =>
                getCustomerName(p).toLowerCase().includes(q) ||
                getProviderName(p).toLowerCase().includes(q) ||
                getServiceTitle(p).toLowerCase().includes(q)
        );
    }, [rows, query]);

    const counts = useMemo(() => {
        const base = { total: rows.length, held: 0, disputed: 0, released: 0 };
        rows.forEach((p) => {
            if (p.status === 'held') base.held += 1;
            else if (p.status === 'disputed') base.disputed += 1;
            else if (p.status === 'released') base.released += 1;
        });
        return base;
    }, [rows]);

    return (
        <AdminLayout title="Bayaran" breadcrumb="Kewangan / Bayaran">
            <Head title="Bayaran — Tukang Perak" />

            {/* ============ HEADER ============ */}
            <div className="provider-page-header">
                <p className="eyebrow">KEWANGAN</p>
                <h1 className="provider-page-heading mt-3">
                    Pengurusan bayaran.
                </h1>
                <p className="provider-page-subtitle">
                    Semak bayaran yang disimpan, selesaikan pertikaian, dan
                    lepaskan bayaran kepada tukang.
                </p>
            </div>

            {/* ============ STAT TILES ============ */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Jumlah"
                        value={counts.total}
                        hint="Semua transaksi"
                        icon={Icon.Card}
                        accent="green"
                    />
                    <StatCard
                        label="Disimpan"
                        value={counts.held}
                        hint="Menunggu kerja selesai"
                        icon={Icon.Shield}
                        accent="sky"
                    />
                    <StatCard
                        label="Pertikaian"
                        value={counts.disputed}
                        hint="Perlu tindakan"
                        icon={Icon.Alert}
                        accent="rose"
                    />
                    <StatCard
                        label="Dilepaskan"
                        value={counts.released}
                        hint="Telah dibayar"
                        icon={Icon.Check}
                        accent="green"
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
                            placeholder="Cari pelanggan, tukang, atau servis..."
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
                                { value: '',         label: 'Semua' },
                                { value: 'held',     label: 'Disimpan' },
                                { value: 'disputed', label: 'Pertikaian' },
                                { value: 'released', label: 'Dilepaskan' },
                                { value: 'refunded', label: 'Dipulangkan' },
                            ].map((tab) => {
                                const active =
                                    (filters.status ?? '') === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => applyFilter(tab.value)}
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
                            Belum ada bayaran
                        </h2>
                        <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                            {filters.status
                                ? 'Tiada bayaran sepadan dengan tapisan ini.'
                                : 'Transaksi akan muncul di sini apabila pelanggan mula membayar.'}
                        </p>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="provider-card">
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--paper)] text-[color:var(--muted)]">
                            <Icon.Search style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Tiada hasil carian
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Cuba tukar kata kunci carian anda.
                        </p>
                    </div>
                </div>
            ) : (
                /* ============ PAYMENT CARDS ============ */
                <div className="flex flex-col gap-4">
                    {filtered.map((payment) => (
                        <PaymentCard key={payment.id} payment={payment} />
                    ))}
                </div>
            )}

            {/* ============ PAGINATION ============ */}
            {payments?.links && payments.links.length > 3 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                    {payments.links.map((link, i) => {
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
        </AdminLayout>
    );
}

/* ============================ PAYMENT CARD ============================ */
function PaymentCard({ payment }) {
    const [note, setNote] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const status = payment.status ?? 'pending';
    const isDisputed = status === 'disputed';

    const handleRelease = () => {
        setError(null);
        setProcessing(true);
        router.patch(
            route('admin.payments.release', payment.id),
            { admin_note: note },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleRefund = () => {
        if (!note.trim()) {
            setError('Sila tambah nota untuk menjelaskan pemulangan.');
            return;
        }
        setError(null);
        setProcessing(true);
        router.patch(
            route('admin.payments.refund', payment.id),
            { admin_note: note },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <article className="provider-card overflow-hidden">
            <div className="p-5 sm:p-6">
                {/* Top row: customer → provider + status */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[color:var(--lime)] text-base font-bold text-[color:var(--green-dark)]">
                            {payment.booking?.customer?.avatar_url ? (
                                <img
                                    src={payment.booking.customer.avatar_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getCustomerInitial(payment)
                            )}
                        </span>

                        <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-[color:var(--ink)]">
                                {getServiceTitle(payment)}
                            </h3>
                            <p className="mt-0.5 truncate text-sm text-[color:var(--muted)]">
                                {getCustomerName(payment)}
                                <span className="mx-1.5 opacity-50">→</span>
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {getProviderName(payment)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <StatusPill status={status} />
                </div>

                {/* Details grid */}
                <dl className="mt-5 grid gap-4 border-t border-[color:var(--line)] pt-5 sm:grid-cols-2">
                    <DetailItem
                        icon={<Icon.Card style={{ width: 13, height: 13 }} />}
                        label="Jumlah bayaran"
                        value={formatCurrency(payment.amount)}
                    />
                    <DetailItem
                        icon={<Icon.Clock style={{ width: 13, height: 13 }} />}
                        label="Tarikh"
                        value={formatDate(payment.created_at)}
                    />

                    {isDisputed && payment.dispute_reason && (
                        <div className="sm:col-span-2">
                            <DetailItem
                                icon={<Icon.Alert style={{ width: 13, height: 13 }} />}
                                label="Sebab pertikaian"
                                value={payment.dispute_reason}
                                multiline
                            />
                        </div>
                    )}

                    {payment.admin_note && (
                        <div className="sm:col-span-2">
                            <DetailItem
                                icon={<Icon.Shield style={{ width: 13, height: 13 }} />}
                                label="Nota admin"
                                value={payment.admin_note}
                                multiline
                            />
                        </div>
                    )}
                </dl>
            </div>

            {/* Action footer — only for disputed payments */}
            {isDisputed && (
                <div className="border-t border-[color:var(--line)] bg-rose-50/40 px-5 py-4 sm:px-6">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">
                        <Icon.Alert style={{ width: 11, height: 11 }} />
                        Tindakan diperlukan
                    </p>
                    <p className="mt-1 text-xs leading-5 text-rose-800/80">
                        Selesaikan pertikaian ini dengan melepaskan bayaran
                        kepada tukang atau memulangkannya kepada pelanggan.
                    </p>

                    <div className="mt-3">
                        <label
                            htmlFor={`note-${payment.id}`}
                            className="block text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]"
                        >
                            Nota keputusan
                        </label>
                        <textarea
                            id={`note-${payment.id}`}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={2}
                            placeholder="Contoh: Kerja disahkan selesai oleh kedua-dua pihak."
                            className="mt-1.5 w-full resize-none rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {error && (
                        <p className="mt-2 text-xs font-semibold text-rose-600">
                            {error}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleRelease}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--green)] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Icon.Check style={{ width: 12, height: 12 }} />
                                    Lepaskan kepada tukang
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleRefund}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Icon.Undo style={{ width: 12, height: 12 }} />
                            Pulangkan kepada pelanggan
                        </button>
                    </div>
                </div>
            )}
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