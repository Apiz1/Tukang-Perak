import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

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
    Clock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 1.8" />
        </svg>
    ),
    Ban: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M5 5l10 10" />
        </svg>
    ),
    Refresh: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M16 4v5h-5" />
            <path d="M4 16v-5h5" />
            <path d="M16 9a6 6 0 00-10.4-3.6L4 7" />
            <path d="M4 11a6 6 0 0010.4 3.6L16 13" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
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
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Eye: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M1.5 10s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6S1.5 10 1.5 10z" />
            <circle cx="10" cy="10" r="2.5" />
        </svg>
    ),
};

/* ---------- Status pill ---------- */
const statusMap = {
    pending:   { label: 'Menunggu',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved:  { label: 'Diluluskan', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected:  { label: 'Ditolak',    cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    suspended: { label: 'Digantung',  cls: 'bg-stone-100 text-stone-700 border-stone-300' },
};

function StatusPill({ status }) {
    const s = statusMap[status] ?? statusMap.pending;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${s.cls}`}>
            {status === 'pending' && <Icon.Clock style={{ width: 10, height: 10 }} />}
            {status === 'approved' && <Icon.Check style={{ width: 10, height: 10 }} />}
            {status === 'rejected' && <Icon.X style={{ width: 10, height: 10 }} />}
            {status === 'suspended' && <Icon.Ban style={{ width: 10, height: 10 }} />}
            {s.label}
        </span>
    );
}

/* ---------- Friendly labels ---------- */
const categoryLabels = {
    aircon: 'Aircond',
    plumbing: 'Paip',
    cleaning: 'Pembersihan',
    electrical: 'Elektrik',
};

const districtLabels = {
    parit_buntar: 'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping: 'Taiping',
    ipoh: 'Ipoh',
    teluk_intan: 'Teluk Intan',
};

/* ============================ PAGE ============================ */
export default function Index({ providers, filters = {} }) {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [processing, setProcessing] = useState(null);

    const [confirmAction, setConfirmAction] = useState(null);
    const [suspensionReason, setSuspensionReason] = useState('');

    const rows = providers?.data ?? [];

    const filtered = useMemo(() => {
        return rows.filter((p) => {
            const matchesQuery =
                !query ||
                p.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
                p.user?.email?.toLowerCase().includes(query.toLowerCase());

            const matchesStatus =
                statusFilter === 'all' || p.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [rows, query, statusFilter]);

    const pendingCount = rows.filter((p) => p.status === 'pending').length;

    const askApprove = (profile) => {
        setSuspensionReason('');
        setConfirmAction({ type: 'approve', provider: profile });
    };
    const askReject = (profile) => {
        setSuspensionReason('');
        setConfirmAction({ type: 'reject', provider: profile });
    };
    const askSuspend = (profile) => {
        setSuspensionReason('');
        setConfirmAction({ type: 'suspend', provider: profile });
    };
    const askUnsuspend = (profile) => {
        setSuspensionReason('');
        setConfirmAction({ type: 'unsuspend', provider: profile });
    };

    const runConfirmedAction = () => {
        if (!confirmAction) return;

        const { type, provider } = confirmAction;
        const id = provider.id;

        setProcessing(id);

        const opts = {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(null);
                setConfirmAction(null);
                setSuspensionReason('');
            },
        };

        const requests = {
            approve: () => router.patch(route('admin.providers.approve', id), {}, opts),
            reject:  () => router.patch(route('admin.providers.reject', id), {}, opts),
            suspend: () =>
                router.patch(
                    route('admin.providers.suspend', id),
                    { suspension_reason: suspensionReason },
                    opts
                ),
            unsuspend: () => router.patch(route('admin.providers.unsuspend', id), {}, opts),
        };

        requests[type]?.();
    };

    return (
        <AdminLayout title="Pengurusan tukang" breadcrumb="Pentadbiran">
            <Head title="Urus tukang — Admin Tukang Perak" />

            {/* Page heading */}
            <div className="admin-page-header">
                <p className="eyebrow">PENGURUSAN</p>
                <h1 className="admin-page-heading mt-3">Urus tukang.</h1>
                <p className="admin-page-subtitle">
                    Semak permohonan, luluskan tukang baharu, dan urus status
                    penyedia perkhidmatan di seluruh Perak.
                </p>
            </div>

            {/* Pending alert */}
            {pendingCount > 0 && statusFilter !== 'pending' && (
                <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                            <Icon.Clock style={{ width: 18, height: 18 }} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-amber-900">
                                {pendingCount} tukang menunggu kelulusan
                            </p>
                            <p className="mt-0.5 text-xs text-amber-800/90">
                                Semak dan luluskan permohonan mereka.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className="inline-flex items-center gap-1.5 self-start rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-amber-700 sm:self-auto"
                    >
                        Tunjuk hanya menunggu
                        <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                    </button>
                </div>
            )}

            {/* Toolbar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                <div className="flex items-center gap-2">
                    <Icon.Filter className="text-[color:var(--muted)]" style={{ width: 16, height: 16 }} />
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { value: 'all',       label: 'Semua' },
                            { value: 'pending',   label: 'Menunggu' },
                            { value: 'approved',  label: 'Diluluskan' },
                            { value: 'suspended', label: 'Digantung' },
                            { value: 'rejected',  label: 'Ditolak' },
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

            {/* Table card */}
            <div className="admin-card overflow-hidden">
                <div className="admin-card__header">
                    <h2 className="admin-card__title">
                        {filtered.length === rows.length
                            ? `${rows.length} tukang`
                            : `${filtered.length} daripada ${rows.length} tukang`}
                    </h2>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Wrench style={{ width: 20, height: 20 }} />
                        </span>
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            {rows.length === 0 ? 'Belum ada tukang berdaftar' : 'Tiada tukang sepadan'}
                        </p>
                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                            {rows.length === 0
                                ? 'Apabila tukang mendaftar, mereka akan dipaparkan di sini.'
                                : 'Cuba tukar carian atau penapis status anda.'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[color:var(--line)] bg-[color:var(--paper)]/60">
                                        <Th>Tukang</Th>
                                        <Th>Kategori</Th>
                                        <Th>Daerah</Th>
                                        <Th>Status</Th>
                                        <Th align="right">Tindakan</Th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[color:var(--line)]">
                                    {filtered.map((profile) => (
                                        <tr key={profile.id} className="transition hover:bg-[color:var(--paper)]/40">
                                            {/* 🆕 Name is now a link to the show page */}
                                            <td className="px-4 py-3.5">
                                                <Link
                                                    href={route('admin.providers.show', profile.id)}
                                                    className="group flex items-center gap-3"
                                                >
                                                    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-xs font-bold text-[color:var(--green-dark)] transition group-hover:ring-2 group-hover:ring-[color:var(--green)]/25">
                                                        {profile.user?.avatar_url ? (
                                                            <img
                                                                src={profile.user.avatar_url}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            profile.user?.name?.charAt(0) ?? 'T'
                                                        )}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-[color:var(--ink)] transition group-hover:text-[color:var(--green-dark)]">
                                                            {profile.user?.name}
                                                        </p>
                                                        <p className="truncate text-xs text-[color:var(--muted)]">
                                                            {profile.user?.email}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </td>

                                            <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                                {categoryLabels[profile.category] ?? profile.category ?? '—'}
                                            </td>

                                            <td className="px-4 py-3.5 text-sm text-[color:var(--ink)]">
                                                {districtLabels[profile.district] ?? profile.district ?? '—'}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1.5">
                                                    <StatusPill status={profile.status} />
                                                    {profile.status === 'suspended' && profile.suspension_reason && (
                                                        <span
                                                            className="max-w-[220px] truncate text-[11px] italic text-[color:var(--muted)]"
                                                            title={profile.suspension_reason}
                                                        >
                                                            “{profile.suspension_reason}”
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 🆕 Actions column: Lihat + status actions */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('admin.providers.show', profile.id)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                                    >
                                                        <Icon.Eye style={{ width: 12, height: 12 }} />
                                                        Lihat
                                                    </Link>

                                                    <ActionButtons
                                                        profile={profile}
                                                        processing={processing}
                                                        onApprove={askApprove}
                                                        onReject={askReject}
                                                        onSuspend={askSuspend}
                                                        onUnsuspend={askUnsuspend}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <ul className="divide-y divide-[color:var(--line)] md:hidden">
                            {filtered.map((profile) => (
                                <li key={profile.id} className="p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                                            {profile.user?.avatar_url ? (
                                                <img
                                                    src={profile.user.avatar_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                profile.user?.name?.charAt(0) ?? 'T'
                                            )}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                        {profile.user?.name}
                                                    </p>
                                                    <p className="truncate text-xs text-[color:var(--muted)]">
                                                        {profile.user?.email}
                                                    </p>
                                                </div>
                                                <StatusPill status={profile.status} />
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                                                <span className="rounded-md bg-[color:var(--paper)] px-2 py-0.5 font-semibold">
                                                    {categoryLabels[profile.category] ?? profile.category ?? '—'}
                                                </span>
                                                <span className="rounded-md bg-[color:var(--paper)] px-2 py-0.5 font-semibold">
                                                    {districtLabels[profile.district] ?? profile.district ?? '—'}
                                                </span>
                                            </div>

                                            {profile.status === 'suspended' && profile.suspension_reason && (
                                                <p className="mt-2 rounded-md bg-stone-100 px-2.5 py-1.5 text-xs italic text-stone-700">
                                                    Sebab: {profile.suspension_reason}
                                                </p>
                                            )}

                                            {/* 🆕 Mobile: Lihat + action buttons */}
                                            <div className="mt-3 flex flex-col gap-2">
                                                <Link
                                                    href={route('admin.providers.show', profile.id)}
                                                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3 py-2 text-xs font-bold text-[color:var(--muted)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                                >
                                                    <Icon.Eye style={{ width: 12, height: 12 }} />
                                                    Lihat butiran penuh
                                                </Link>

                                                <ActionButtons
                                                    profile={profile}
                                                    processing={processing}
                                                    onApprove={askApprove}
                                                    onReject={askReject}
                                                    onSuspend={askSuspend}
                                                    onUnsuspend={askUnsuspend}
                                                    mobile
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {/* Pagination */}
                {providers?.links && providers.links.length > 3 && (
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-[color:var(--line)] px-4 py-3 sm:flex-row">
                        <p className="text-xs text-[color:var(--muted)]">
                            Menunjukkan {providers.from ?? 0}–{providers.to ?? 0} daripada{' '}
                            {providers.total ?? 0} tukang
                        </p>

                        <div className="flex flex-wrap items-center gap-1">
                            {providers.links.map((link, i) => {
                                const isPrev = i === 0;
                                const isNext = i === providers.links.length - 1;

                                if (!link.url) {
                                    return (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[color:var(--muted)] opacity-50"
                                        >
                                            {isPrev && <Icon.ArrowLeft style={{ width: 12, height: 12 }} />}
                                            {isPrev ? 'Sebelum' : isNext ? 'Seterusnya' : link.label}
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
                                        {isPrev ? 'Sebelum' : isNext ? 'Seterusnya' : link.label}
                                        {isNext && <Icon.ArrowRight style={{ width: 12, height: 12 }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation modal */}
            {confirmAction && (
                <ConfirmModal
                    action={confirmAction}
                    processing={processing === confirmAction.provider.id}
                    reason={suspensionReason}
                    onReasonChange={setSuspensionReason}
                    onCancel={() => {
                        if (processing) return;
                        setConfirmAction(null);
                        setSuspensionReason('');
                    }}
                    onConfirm={runConfirmedAction}
                />
            )}
        </AdminLayout>
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

/* ---------- Action buttons (desktop + mobile variants) ---------- */
function ActionButtons({
    profile,
    processing,
    onApprove,
    onReject,
    onSuspend,
    onUnsuspend,
    mobile = false,
}) {
    const status = profile.status;
    const busy = processing === profile.id;

    const wrap = mobile ? 'flex items-center gap-2' : 'inline-flex items-center gap-2';

    const baseBtn = mobile
        ? 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60'
        : 'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60';

    if (status === 'pending') {
        return (
            <div className={wrap}>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => onApprove(profile)}
                    className={`${baseBtn} bg-[color:var(--green)] text-white hover:bg-[color:var(--green-dark)]`}
                >
                    <Icon.Check style={{ width: 12, height: 12 }} />
                    Luluskan
                </button>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => onReject(profile)}
                    className={`${baseBtn} border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`}
                >
                    <Icon.X style={{ width: 12, height: 12 }} />
                    Tolak
                </button>
            </div>
        );
    }

    if (status === 'approved') {
        return (
            <div className={wrap}>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => onSuspend(profile)}
                    className={`${baseBtn} border border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50`}
                >
                    <Icon.Ban style={{ width: 12, height: 12 }} />
                    Gantung
                </button>
            </div>
        );
    }

    if (status === 'suspended') {
        return (
            <div className={wrap}>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => onUnsuspend(profile)}
                    className={`${baseBtn} bg-[color:var(--green)] text-white hover:bg-[color:var(--green-dark)]`}
                >
                    <Icon.Refresh style={{ width: 12, height: 12 }} />
                    Aktifkan semula
                </button>
            </div>
        );
    }

    return <span className="text-xs text-[color:var(--muted)]">—</span>;
}

/* ============================ CONFIRM MODAL ============================ */
function ConfirmModal({ action, processing, reason, onReasonChange, onCancel, onConfirm }) {
    const { type } = action;
    const provider = action.provider;

    const config = {
        approve: {
            icon: <Icon.Check style={{ width: 26, height: 26 }} />,
            tone: 'emerald',
            title: 'Luluskan tukang ini?',
            message: 'Tukang ini akan dapat mengakses tempahan dan menawarkan perkhidmatan mereka di platform.',
            confirmLabel: 'Ya, luluskan',
        },
        reject: {
            icon: <Icon.Alert style={{ width: 26, height: 26 }} />,
            tone: 'rose',
            title: 'Tolak permohonan ini?',
            message: 'Tukang ini tidak akan dapat menerima tempahan. Anda boleh ubah keputusan ini kemudian.',
            confirmLabel: 'Ya, tolak',
        },
        suspend: {
            icon: <Icon.Ban style={{ width: 26, height: 26 }} />,
            tone: 'rose',
            title: 'Gantung tukang ini?',
            message: 'Akaun akan digantung sementara. Tukang tidak akan dapat menerima tempahan baharu sehingga diaktifkan semula.',
            confirmLabel: 'Ya, gantung',
        },
        unsuspend: {
            icon: <Icon.Refresh style={{ width: 26, height: 26 }} />,
            tone: 'emerald',
            title: 'Aktifkan semula tukang ini?',
            message: 'Tukang akan kembali boleh menerima tempahan seperti biasa.',
            confirmLabel: 'Ya, aktifkan',
        },
    }[type];

    if (!config) return null;

    const toneClasses = {
        emerald: {
            iconWrap: 'bg-emerald-50 text-emerald-700',
            confirmBtn: 'bg-[color:var(--green)] hover:bg-[color:var(--green-dark)] text-white',
        },
        rose: {
            iconWrap: 'bg-rose-50 text-rose-700',
            confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
        },
    }[config.tone];

    const requiresReason = type === 'suspend';
    const reasonTooShort = requiresReason && reason.trim().length < 5;

    useEffect(() => {
        const onKey = (e) => {
            if (processing) return;
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter' && !reasonTooShort) onConfirm();
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onCancel, onConfirm, processing, reasonTooShort]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
            <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${toneClasses.iconWrap}`}>
                        {config.icon}
                    </div>

                    <h2 id="confirm-modal-title" className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]">
                        {config.title}
                    </h2>

                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                            {provider.user?.avatar_url ? (
                                <img src={provider.user.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                                provider.user?.name?.charAt(0) ?? 'T'
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {provider.user?.name}
                            </p>
                            <p className="truncate text-xs text-[color:var(--muted)]">
                                {provider.user?.email}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                        {config.message}
                    </p>

                    {requiresReason && (
                        <div className="mt-4">
                            <label htmlFor="suspension_reason" className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]">
                                Sebab penggantungan
                            </label>
                            <textarea
                                id="suspension_reason"
                                value={reason}
                                onChange={(e) => onReasonChange(e.target.value)}
                                rows={3}
                                maxLength={300}
                                placeholder="Contoh: Aduan pelanggan berulang kali tentang kerja tidak siap."
                                className="mt-1.5 w-full resize-none rounded-xl border border-[color:var(--line)] bg-white px-3 py-2.5 text-sm leading-6 text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                            />
                            <div className="mt-1 flex items-center justify-between text-[11px] text-[color:var(--muted)]">
                                <span>
                                    {reasonTooShort
                                        ? 'Sekurang-kurangnya 5 aksara.'
                                        : 'Sebab ini akan dipaparkan kepada tukang.'}
                                </span>
                                <span>{reason.length}/300</span>
                            </div>
                        </div>
                    )}

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
                            disabled={processing || reasonTooShort}
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