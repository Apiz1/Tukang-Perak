// resources/js/Pages/Admin/Reports/Show.jsx
import { Head, Link, useForm } from '@inertiajs/react';
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
    Flag: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 3v14" />
            <path d="M4 4h9l-1.5 3L13 10H4" />
        </svg>
    ),
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
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

/* ---------- Static label maps ---------- */
const reasonLabels = {
    harassment:    'Gangguan / ugutan',
    no_show:       'Tukang tidak hadir',
    scam:          'Penipuan / scam',
    inappropriate: 'Tingkah laku tidak wajar',
    other:         'Lain-lain',
};

/* 🆕 Only two outcomes allowed by the controller's validation */
const reportStatusConfig = {
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
const formatDate = (date, style = 'long') => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: style === 'short' ? 'short' : 'long',
        year: 'numeric',
    });
};

const getInitial = (name) => (name ?? '?').charAt(0).toUpperCase();

const getReasonLabel = (value) => reasonLabels[value] ?? value ?? '—';

/* ---------- Status pill ---------- */
function StatusPill({ status }) {
    const config = reportStatusConfig[status] ?? reportStatusConfig.pending;
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
export default function Show({ report, providerReportCount = 0 }) {
    const { data, setData, patch, processing, errors } = useForm({
        status: report.status ?? 'dismissed',
        admin_note: report.admin_note ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.reports.update', report.id), {
            preserveScroll: true,
        });
    };

    const reporterName = report?.reporter?.name ?? 'Pelanggan';
    const providerName =
        report?.provider?.name ??
        report?.provider?.provider_profile?.business_name ??
        'Tukang';

    const providerProfileId = report?.provider?.provider_profile?.id;

    /* 🆕 The controller already counted all reports including this one */
    const hasOtherReports = providerReportCount > 1;

    return (
        <AdminLayout title="Butiran Laporan" breadcrumb="Pengurusan / Laporan">
            <Head title={`Laporan #${report.id} — Admin Tukang Perak`} />

            {/* Back link */}
            <Link
                href={route('admin.reports.index')}
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
            >
                <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                Kembali ke senarai laporan
            </Link>

            {/* ============ HERO CARD ============ */}
            <div className="admin-card overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                                <Icon.Flag style={{ width: 24, height: 24 }} />
                            </span>

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600">
                                    LAPORAN
                                </p>
                                <h1 className="mt-1.5 font-serif text-2xl tracking-tight text-[color:var(--ink)] sm:text-3xl">
                                    {getReasonLabel(report.reason)}
                                </h1>
                                <p className="mt-1 text-sm text-[color:var(--muted)]">
                                    Dihantar oleh{' '}
                                    <span className="font-semibold text-[color:var(--ink)]">
                                        {reporterName}
                                    </span>{' '}
                                    pada {formatDate(report.created_at)}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <StatusPill status={report.status} />
                                    {hasOtherReports && (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                                            <Icon.Alert style={{ width: 10, height: 10 }} />
                                            {providerReportCount} laporan untuk tukang ini
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============ MAIN GRID ============ */}
            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* LEFT: report details + admin form */}
                <div className="flex flex-col gap-6">
                    {/* Report content */}
                    <div className="admin-card">
                        <div className="border-b border-[color:var(--line)] px-5 py-4 sm:px-6">
                            <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                Butiran laporan
                            </h2>
                            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                Apa yang pelanggan laporkan
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                            <DetailRow
                                icon={<Icon.User style={{ width: 14, height: 14 }} />}
                                label="Pelapor"
                                value={reporterName}
                            />
                            <DetailRow
                                icon={<Icon.Wrench style={{ width: 14, height: 14 }} />}
                                label="Tukang"
                                value={providerName}
                            />
                            <DetailRow
                                icon={<Icon.Flag style={{ width: 14, height: 14 }} />}
                                label="Sebab"
                                value={getReasonLabel(report.reason)}
                            />
                            <DetailRow
                                icon={<Icon.Clock style={{ width: 14, height: 14 }} />}
                                label="Tarikh laporan"
                                value={formatDate(report.created_at)}
                            />

                            <div className="sm:col-span-2">
                                <DetailRow
                                    icon={<Icon.Info style={{ width: 14, height: 14 }} />}
                                    label="Butiran lanjut"
                                    value={
                                        report.details || (
                                            <span className="italic text-[color:var(--muted)]">
                                                Pelapor tidak memberikan butiran lanjut.
                                            </span>
                                        )
                                    }
                                    multiline
                                />
                            </div>
                        </div>
                    </div>

                    {/* Admin form */}
                    <form
                        onSubmit={submit}
                        className="admin-card"
                    >
                        <div className="border-b border-[color:var(--line)] px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Shield style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                        Tindakan pentadbir
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Tentukan hasil siasatan anda
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-semibold text-[color:var(--ink)]"
                                >
                                    Status
                                </label>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    Hasil siasatan laporan ini
                                </p>

                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                >
                                    <option value="action_taken">
                                        Tindakan telah diambil
                                    </option>
                                    <option value="dismissed">
                                        Ditolak — tidak ada tindakan
                                    </option>
                                </select>

                                {errors.status && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            {/* Admin note */}
                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label
                                        htmlFor="admin_note"
                                        className="block text-sm font-semibold text-[color:var(--ink)]"
                                    >
                                        Nota pentadbir
                                    </label>
                                    <span className="text-[11px] text-[color:var(--muted)]">
                                        {data.admin_note.length}/2000
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    Wajib diisi — direkodkan untuk rujukan dalaman
                                </p>

                                <textarea
                                    id="admin_note"
                                    value={data.admin_note}
                                    onChange={(e) =>
                                        setData('admin_note', e.target.value)
                                    }
                                    rows={4}
                                    maxLength={2000}
                                    required
                                    placeholder="Contoh: Telah menghubungi pelanggan dan tukang, isu telah diselesaikan."
                                    className="mt-2 w-full resize-none rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                />

                                {errors.admin_note && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.admin_note}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-end">
                                <Link
                                    href={route('admin.reports.index')}
                                    className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)]"
                                >
                                    Batal
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing || !data.admin_note.trim()}
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--green)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Check style={{ width: 14, height: 14 }} />
                                            Simpan tindakan
                                            <Icon.ArrowRight
                                                className="transition-transform group-hover:translate-x-0.5"
                                                style={{ width: 14, height: 14 }}
                                            />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* RIGHT: sidebar */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                    {/* Reporter card */}
                    <div className="admin-card p-5">
                        <h3 className="text-sm font-bold text-[color:var(--ink)]">
                            Pelapor
                        </h3>

                        <div className="mt-4 flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                                {getInitial(reporterName)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                    {reporterName}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Provider card */}
                    <div className="admin-card p-5">
                        <h3 className="text-sm font-bold text-[color:var(--ink)]">
                            Tukang dilaporkan
                        </h3>

                        <div className="mt-4 flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-sm font-bold text-rose-700">
                                <Icon.Wrench style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                    {providerName}
                                </p>
                            </div>
                        </div>

                        {/* Report count badge */}
                        {hasOtherReports && (
                            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/60 p-3">
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-700">
                                    <Icon.Alert style={{ width: 13, height: 13 }} />
                                </span>
                                <span className="text-[11px] leading-snug text-rose-800">
                                    <span className="font-bold">
                                        {providerReportCount} laporan
                                    </span>{' '}
                                    telah direkodkan terhadap tukang ini
                                    (termasuk laporan ini). Semak corak aduan
                                    sebelum mengambil tindakan.
                                </span>
                            </div>
                        )}

                        {providerProfileId && (
                            <Link
                                href={route('admin.providers.show', providerProfileId)}
                                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-xs font-bold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                            >
                                <Icon.Wrench style={{ width: 12, height: 12 }} />
                                Lihat profil tukang
                                <Icon.ArrowRight style={{ width: 11, height: 11 }} />
                            </Link>
                        )}
                    </div>

                    {/* Trust card */}
                    <div className="admin-card bg-[color:var(--paper)]/50 p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--green)] text-white">
                                <Icon.Shield style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-[color:var(--ink)]">
                                    Siasatan sulit
                                </p>
                                <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                                    Nota dalaman ini tidak akan dikongsi dengan
                                    pelapor atau tukang.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
}