// resources/js/Pages/Admin/ActivityLogs/Index.jsx
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

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
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        </svg>
    ),
    List: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 5h12M4 10h12M4 15h8" />
        </svg>
    ),
    Inbox: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 10l2-6h10l2 6v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z" />
            <path d="M3 10h4l1 2h4l1-2h4" />
        </svg>
    ),
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
    Chevron: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M6 8l4 4 4-4" />
        </svg>
    ),
    X: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 5l10 10M15 5L5 15" />
        </svg>
    ),
};

/* ---------- Labels ---------- */
const CATEGORY_LABELS = {
    auth: 'Log masuk',
    user: 'Pendaftaran',
    provider: 'Tukang',
    customer: 'Pelanggan',
    booking: 'Tempahan',
    payment: 'Pembayaran',
    report: 'Laporan',
    security: 'Keselamatan',
};

const categoryToneMap = {
    auth:     'border-sky-200 bg-sky-50 text-sky-700',
    user:     'border-violet-200 bg-violet-50 text-violet-700',
    provider: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    customer: 'border-teal-200 bg-teal-50 text-teal-700',
    booking:  'border-amber-200 bg-amber-50 text-amber-700',
    payment:  'border-indigo-200 bg-indigo-50 text-indigo-700',
    report:   'border-rose-200 bg-rose-50 text-rose-700',
    security: 'border-rose-200 bg-rose-50 text-rose-700',
};

/* ---------- Helpers ---------- */
const getCategory = (log) => {
    const action = log?.action ?? '';
    const prefix = action.split('.')[0];
    return prefix || '';
};

const isSecurity = (log) => (log?.action ?? '').startsWith('security.');

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

/* ---------- Category pill ---------- */
function CategoryPill({ category }) {
    if (!category) return null;
    const cls = categoryToneMap[category] ?? 'border-stone-200 bg-stone-100 text-stone-700';
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
            {CATEGORY_LABELS[category] ?? category}
        </span>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ logs, filters = {}, categories = [] }) {
    const [form, setForm] = useState({
        category: filters.category ?? '',
        search: filters.search ?? '',
        from: filters.from ?? '',
        to: filters.to ?? '',
    });
    const [openId, setOpenId] = useState(null);

    const rows = logs?.data ?? [];

    const apply = (e) => {
        e.preventDefault();
        const params = Object.fromEntries(
            Object.entries(form).filter(([, v]) => v !== '')
        );
        router.get(route('admin.activity-logs.index'), params, {
            preserveState: true,
        });
    };

    const reset = () => {
        setForm({ category: '', search: '', from: '', to: '' });
        router.get(route('admin.activity-logs.index'));
    };

    const setFilterAndApply = (category) => {
        const next = { ...form, category };
        setForm(next);
        const params = Object.fromEntries(
            Object.entries(next).filter(([, v]) => v !== '')
        );
        router.get(route('admin.activity-logs.index'), params, {
            preserveState: true,
        });
    };

    const counts = useMemo(
        () => ({
            total: logs?.total ?? rows.length,
            security: rows.filter((l) => isSecurity(l)).length,
            guests: rows.filter((l) => !l.user).length,
            users: rows.filter((l) => Boolean(l.user)).length,
        }),
        [rows, logs?.total]
    );

    const hasActiveFilters =
        form.category !== '' ||
        form.search !== '' ||
        form.from !== '' ||
        form.to !== '';

    return (
        <AdminLayout title="Log aktiviti" breadcrumb="Pengurusan / Log aktiviti">
            <Head title="Log aktiviti — Admin Tukang Perak" />

            {/* ============ HEADER ============ */}
            <div className="admin-page-header">
                <p className="eyebrow">PENGURUSAN</p>
                <h1 className="admin-page-heading mt-3">Log aktiviti.</h1>
                <p className="admin-page-subtitle">
                    Jejak semua tindakan penting dalam sistem untuk tujuan audit
                    dan keselamatan.
                </p>
            </div>

            {/* ============ STAT TILES ============ */}
            {rows.length > 0 && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Jumlah log"
                        value={counts.total}
                        hint="Sepanjang masa"
                        icon={Icon.List}
                        accent="ink"
                    />
                    <StatCard
                        label="Keselamatan"
                        value={counts.security}
                        hint="Tindakan keselamatan"
                        icon={Icon.Shield}
                        accent="rose"
                    />
                    <StatCard
                        label="Pengguna berdaftar"
                        value={counts.users}
                        hint="Tindakan oleh pengguna"
                        icon={Icon.User}
                        accent="green"
                    />
                    <StatCard
                        label="Sistem / tetamu"
                        value={counts.guests}
                        hint="Tanpa pengguna"
                        icon={Icon.Clock}
                        accent="amber"
                    />
                </section>
            )}

            {/* ============ TOOLBAR / FILTERS ============ */}
            <form
                onSubmit={apply}
                className="mt-6 mb-5 flex flex-col gap-3 rounded-2xl border border-[color:var(--line)] bg-white p-4 sm:p-5"
            >
                {/* Row 1: category chips */}
                <div className="flex flex-wrap items-center gap-2">
                    <Icon.Filter
                        className="text-[color:var(--muted)]"
                        style={{ width: 16, height: 16 }}
                    />
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setFilterAndApply('')}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                form.category === ''
                                    ? 'border-[color:var(--green)] bg-[color:var(--green)] text-white'
                                    : 'border-[color:var(--line)] bg-white text-[color:var(--muted)] hover:border-[#a9cdb4] hover:text-[color:var(--green)]'
                            }`}
                        >
                            Semua kategori
                        </button>

                        {categories.map((c) => {
                            const active = form.category === c;
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFilterAndApply(c)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                        active
                                            ? 'border-[color:var(--green)] bg-[color:var(--green)] text-white'
                                            : 'border-[color:var(--line)] bg-white text-[color:var(--muted)] hover:border-[#a9cdb4] hover:text-[color:var(--green)]'
                                    }`}
                                >
                                    {CATEGORY_LABELS[c] ?? c}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Row 2: search + dates */}
                <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    {/* Search */}
                    <div className="relative">
                        <Icon.Search
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <input
                            type="text"
                            placeholder="Cari penerangan..."
                            value={form.search}
                            onChange={(e) =>
                                setForm({ ...form, search: e.target.value })
                            }
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* From */}
                    <div className="relative">
                        <Icon.Calendar
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <input
                            type="date"
                            value={form.from}
                            onChange={(e) =>
                                setForm({ ...form, from: e.target.value })
                            }
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>

                    {/* To */}
                    <div className="relative">
                        <Icon.Calendar
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]"
                            style={{ width: 16, height: 16 }}
                        />
                        <input
                            type="date"
                            value={form.to}
                            onChange={(e) =>
                                setForm({ ...form, to: e.target.value })
                            }
                            className="w-full rounded-xl border border-[color:var(--line)] bg-white py-2.5 pl-9 pr-3 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                        />
                    </div>
                </div>

                {/* Row 3: actions */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--line)] bg-white px-3.5 py-2 text-xs font-bold text-[color:var(--muted)] transition hover:border-stone-300 hover:text-[color:var(--ink)]"
                        >
                            <Icon.X style={{ width: 12, height: 12 }} />
                            Set semula
                        </button>
                    )}

                    <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--green)] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] hover:shadow-md"
                    >
                        <Icon.Filter style={{ width: 12, height: 12 }} />
                        Tapis
                    </button>
                </div>
            </form>

            {/* ============ TABLE CARD ============ */}
            <div className="admin-card overflow-hidden">
                <div className="admin-card__header">
                    <h2 className="admin-card__title">
                        {logs?.total != null
                            ? `${logs.total} log`
                            : `${rows.length} log`}
                    </h2>
                </div>

                {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Inbox style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Tiada rekod log
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            Tiada aktiviti sepadan dengan penapis anda. Cuba
                            tukar carian atau tarikh.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[color:var(--line)] bg-[color:var(--paper)]/60">
                                        <Th>Masa</Th>
                                        <Th>Pengguna</Th>
                                        <Th>Tindakan</Th>
                                        <Th>Penerangan</Th>
                                        <Th>IP</Th>
                                        <Th align="right"></Th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[color:var(--line)]">
                                    {rows.map((log) => {
                                        const category = getCategory(log);
                                        const security = isSecurity(log);
                                        const open = openId === log.id;

                                        return (
                                            <FragmentRow
                                                key={log.id}
                                                log={log}
                                                category={category}
                                                security={security}
                                                open={open}
                                                onToggle={() =>
                                                    setOpenId(open ? null : log.id)
                                                }
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile list */}
                        <ul className="divide-y divide-[color:var(--line)] md:hidden">
                            {rows.map((log) => {
                                const category = getCategory(log);
                                const security = isSecurity(log);
                                const open = openId === log.id;

                                return (
                                    <li key={log.id} className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="flex flex-wrap items-center gap-1.5">
                                                    <CategoryPill category={category} />
                                                    {security && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                                                            <Icon.Shield style={{ width: 10, height: 10 }} />
                                                            Keselamatan
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="mt-1 truncate text-sm font-semibold text-[color:var(--ink)]">
                                                    {log.action}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                                    {log.user?.name ?? 'Sistem / Tetamu'}
                                                    {' · '}
                                                    {formatDateTime(log.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {log.description && (
                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[color:var(--muted)]">
                                                {log.description}
                                            </p>
                                        )}

                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <span className="truncate text-[11px] text-[color:var(--muted)]">
                                                IP: {log.ip_address ?? '—'}
                                            </span>

                                            {log.properties && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenId(open ? null : log.id)
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                                >
                                                    {open ? 'Sembunyi' : 'Butiran'}
                                                    <Icon.Chevron
                                                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                                                        style={{ width: 12, height: 12 }}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {open && log.properties && (
                                            <pre className="mt-2 max-h-72 overflow-auto rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3 text-[11px] leading-5 text-[color:var(--ink)]">
                                                {JSON.stringify(log.properties, null, 2)}
                                            </pre>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}

                {/* Pagination */}
                {logs?.links && logs.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[color:var(--line)] px-4 py-3 sm:flex-row">
                        <p className="text-xs text-[color:var(--muted)]">
                            Menunjukkan {logs.from ?? 0}–{logs.to ?? 0} daripada{' '}
                            {logs.total ?? 0} log
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {logs.links.map((link, i) => {
                                const isPrev = i === 0;
                                const isNext = i === logs.links.length - 1;
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

/* ---------- Desktop row + expandable details ---------- */
function FragmentRow({ log, category, security, open, onToggle }) {
    return (
        <>
            <tr className="transition hover:bg-[color:var(--paper)]/40">
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[color:var(--muted)]">
                    {formatDateTime(log.created_at)}
                </td>

                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-[11px] font-bold text-[color:var(--green-dark)]">
                            {log.user?.avatar_url ? (
                                <img
                                    src={log.user.avatar_url}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : log.user ? (
                                log.user.name?.charAt(0) ?? 'U'
                            ) : (
                                <Icon.Shield style={{ width: 12, height: 12 }} />
                            )}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {log.user?.name ?? 'Sistem / Tetamu'}
                            </p>
                            {log.user?.email && (
                                <p className="truncate text-[11px] text-[color:var(--muted)]">
                                    {log.user.email}
                                </p>
                            )}
                        </div>
                    </div>
                </td>

                <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <CategoryPill category={category} />
                        {security && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                                <Icon.Shield style={{ width: 10, height: 10 }} />
                                Keselamatan
                            </span>
                        )}
                    </div>
                    <p className="mt-1 truncate text-xs text-[color:var(--muted)]">
                        {log.action}
                    </p>
                </td>

                <td className="px-4 py-3.5">
                    <p className="line-clamp-2 max-w-md text-sm text-[color:var(--ink)]">
                        {log.description ?? '—'}
                    </p>
                </td>

                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-[color:var(--muted)]">
                    {log.ip_address ?? '—'}
                </td>

                <td className="px-4 py-3.5 text-right">
                    {log.properties && (
                        <button
                            type="button"
                            onClick={onToggle}
                            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                        >
                            {open ? 'Sembunyi' : 'Butiran'}
                            <Icon.Chevron
                                className={`transition-transform ${open ? 'rotate-180' : ''}`}
                                style={{ width: 12, height: 12 }}
                            />
                        </button>
                    )}
                </td>
            </tr>

            {open && log.properties && (
                <tr className="bg-[color:var(--paper)]/40">
                    <td colSpan={6} className="px-4 py-3">
                        <pre className="max-h-72 overflow-auto rounded-lg border border-[color:var(--line)] bg-white p-3 text-[11px] leading-5 text-[color:var(--ink)]">
                            {JSON.stringify(log.properties, null, 2)}
                        </pre>
                    </td>
                </tr>
            )}
        </>
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

/* ---------- Pagination label helper ---------- */
function stripHtml(html) {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').trim();
}