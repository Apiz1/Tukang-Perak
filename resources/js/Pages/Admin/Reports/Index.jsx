// resources/js/Pages/Admin/Reports/Index.jsx
import { Head, Link } from '@inertiajs/react';
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
    Flag: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 3v14" />
            <path d="M4 4h9l-1.5 3L13 10H4" />
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
};

/* ---------- Reason labels (mirrors Report::REASON_LABELS) ---------- */
const reasonLabels = {
    harassment:    'Gangguan / ugutan',
    no_show:       'Tukang tidak hadir',
    scam:          'Penipuan / scam',
    inappropriate: 'Tingkah laku tidak wajar',
    other:         'Lain-lain',
};

/* ---------- Status config — matches what the app actually produces ---------- */
const statusConfig = {
    pending: {
        label: 'Menunggu',
        cls: 'border-amber-200 bg-amber-50 text-amber-700',
        icon: Icon.Clock,
    },
    dismissed: {
        label: 'Ditolak',
        cls: 'border-stone-200 bg-stone-100 text-stone-600',
        icon: Icon.X,
    },
    action_taken: {
        label: 'Tindakan diambil',
        cls: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        icon: Icon.Check,
    },
};

/* ---------- Helpers ---------- */
const formatDate = (date, style = 'short') => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: style === 'short' ? 'short' : 'long',
        year: 'numeric',
    });
};

const getReporterName = (report) =>
    report?.reporter?.name ?? 'Pelanggan';

const getReporterInitial = (report) =>
    getReporterName(report).charAt(0).toUpperCase();

const getProviderName = (report) =>
    report?.provider?.name ??
    report?.provider?.provider_profile?.business_name ??
    'Tukang';

const getReasonLabel = (value) => reasonLabels[value] ?? value ?? '—';

const getStatus = (report) => report.status ?? 'pending';

const stripHtml = (html) => {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').trim();
};

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
    const config = statusConfig[status] ?? statusConfig.pending;
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
export default function Index({ reports }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const rows = Array.isArray(reports) ? reports : reports.data ?? [];

    const filtered = useMemo(() => {
        return rows.filter((r) => {
            const q = query.toLowerCase();
            const matchesQuery =
                !query ||
                getReporterName(r).toLowerCase().includes(q) ||
                getProviderName(r).toLowerCase().includes(q) ||
                getReasonLabel(r.reason).toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === 'all' || getStatus(r) === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [rows, query, statusFilter]);

    const counts = useMemo(
        () => ({
            total: rows.length,
            pending: rows.filter((r) => getStatus(r) === 'pending').length,
            actionTaken: rows.filter((r) => getStatus(r) === 'action_taken').length,
            dismissed: rows.filter((r) => getStatus(r) === 'dismissed').length,
        }),
        [rows]
    );

    return (
        <AdminLayout title="Laporan" breadcrumb="Pengurusan / Laporan">
            <Head title="Laporan — Admin Tukang Perak" />

            {/* ============ HEADER ============ */}
            <div className="admin-page-header">
                <p className="eyebrow">PENGURUSAN</p>
                <h1 className="admin-page-heading mt-3">
                    Laporan pengguna.
                </h1>
                <p className="admin-page-subtitle">
                    Semak laporan yang dihantar oleh pelanggan terhadap tukang.
                    Tentukan tindakan yang sewajarnya.
                </p>
            </div>

            {/* ============ STAT TILES ============ */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Jumlah laporan"
                        value={counts.total}
                        hint="Sepanjang masa"
                        icon={Icon.Flag}
                        accent="ink"
                    />
                    <StatCard
                        label="Menunggu"
                        value={counts.pending}
                        hint="Perlu tindakan segera"
                        icon={Icon.Clock}
                        accent="amber"
                    />
                    <StatCard
                        label="Tindakan diambil"
                        value={counts.actionTaken}
                        hint="Telah diselesaikan"
                        icon={Icon.Check}
                        accent="green"
                    />
                    <StatCard
                        label="Ditolak"
                        value={counts.dismissed}
                        hint="Tiada tindakan"
                        icon={Icon.X}
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
                            placeholder="Cari pelapor, tukang, atau sebab..."
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* Status filter tabs — only states the app produces */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Icon.Filter
                            className="text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { value: 'all',          label: 'Semua' },
                                { value: 'pending',      label: 'Menunggu' },
                                { value: 'action_taken', label: 'Tindakan diambil' },
                                { value: 'dismissed',    label: 'Ditolak' },
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
                            Belum ada laporan
                        </h2>
                        <p className="max-w-md text-sm leading-6 text-[color:var(--muted)]">
                            Laporan daripada pelanggan akan muncul di sini
                            apabila mereka menghantar maklum balas.
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
                            Tiada laporan sepadan
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Cuba tukar carian atau penapis status anda.
                        </p>
                    </div>
                </div>
            ) : (
                /* ============ REPORTS LIST ============ */
                <div className="flex flex-col gap-4">
                    {filtered.map((report) => (
                        <ReportCard key={report.id} report={report} />
                    ))}
                </div>
            )}

            {/* ============ PAGINATION ============ */}
            {reports?.links && reports.links.length > 3 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-1">
                    {reports.links.map((link, i) => {
                        const label = stripHtml(link.label);

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

/* ============================ REPORT CARD ============================ */
function ReportCard({ report }) {
    const status = getStatus(report);
    const reporterName = getReporterName(report);
    const providerName = getProviderName(report);
    const reasonLabel = getReasonLabel(report.reason);

    return (
        <article className="admin-card overflow-hidden">
            <Link
                href={route('admin.reports.show', report.id)}
                className="group block p-5 transition hover:bg-[color:var(--paper)]/40 sm:p-6"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Reporter → Provider */}
                    <div className="flex min-w-0 items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-base font-bold text-rose-700">
                            <Icon.Flag style={{ width: 18, height: 18 }} />
                        </span>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-bold text-[color:var(--ink)] transition group-hover:text-[color:var(--green-dark)]">
                                    {reasonLabel}
                                </h3>
                                <StatusPill status={status} />
                            </div>

                            <p className="mt-1 truncate text-sm text-[color:var(--muted)]">
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {reporterName}
                                </span>
                                <span className="mx-1.5 opacity-50">→</span>
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {providerName}
                                </span>
                            </p>

                            {/* Details preview */}
                            {report.details && (
                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[color:var(--muted)]">
                                    {report.details}
                                </p>
                            )}
                        </div>
                    </div>

                    <Icon.ArrowRight
                        className="hidden shrink-0 text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)] sm:block"
                        style={{ width: 16, height: 16 }}
                    />
                </div>

                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[color:var(--line)] pt-4 text-xs text-[color:var(--muted)]">
                    <span className="inline-flex items-center gap-1.5">
                        <Icon.Clock style={{ width: 12, height: 12 }} />
                        {formatDate(report.created_at, 'long')}
                    </span>
                </div>
            </Link>
        </article>
    );
}