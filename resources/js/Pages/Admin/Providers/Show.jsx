import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ---------- Small inline icons ---------- */
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
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    MapPin: (p) => (
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
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
};

/* ---------- Status pill ---------- */
const statusMap = {
    pending:   { label: 'Menunggu',    cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved:  { label: 'Diluluskan',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected:  { label: 'Ditolak',     cls: 'bg-rose-50 text-rose-700 border-rose-200' },
    suspended: { label: 'Digantung',   cls: 'bg-stone-100 text-stone-700 border-stone-300' },
};

function StatusPill({ status }) {
    const s = statusMap[status] ?? statusMap.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${s.cls}`}>
            {status === 'pending' && <Icon.Clock style={{ width: 11, height: 11 }} />}
            {status === 'approved' && <Icon.Check style={{ width: 11, height: 11 }} />}
            {status === 'rejected' && <Icon.X style={{ width: 11, height: 11 }} />}
            {status === 'suspended' && <Icon.Ban style={{ width: 11, height: 11 }} />}
            {s.label}
        </span>
    );
}

/* ---------- Friendly labels ---------- */
const categoryLabels = {
    aircon: 'Aircond Repair & Servicing',
    plumbing: 'Plumbing',
    cleaning: 'House Cleaning',
    electrical: 'Electrical',
};

const districtLabels = {
    parit_buntar: 'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping: 'Taiping',
    ipoh: 'Ipoh',
    teluk_intan: 'Teluk Intan',
};

const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

/* ============================ PAGE ============================ */
export default function Show({ provider }) {
    const { flash } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // 'approve' | 'reject' | 'suspend' | 'unsuspend'
    const [suspensionReason, setSuspensionReason] = useState('');
    const [toast, setToast] = useState(null);

    /* Success toast from flash */
    useEffect(() => {
        if (flash?.status) {
            setToast(flash.status);
            const t = setTimeout(() => setToast(null), 4500);
            return () => clearTimeout(t);
        }
    }, [flash?.status]);

    /* Open a confirmation modal */
    const ask = (type) => {
        setSuspensionReason('');
        setConfirmAction(type);
    };

    /* Fire the actual request */
    const confirm = () => {
        if (!confirmAction) return;
        setProcessing(true);

        const opts = {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setConfirmAction(null);
                setSuspensionReason('');
            },
        };

        const id = provider.id;

        if (confirmAction === 'approve') {
            router.patch(route('admin.providers.approve', id), {}, opts);
        } else if (confirmAction === 'reject') {
            router.patch(route('admin.providers.reject', id), {}, opts);
        } else if (confirmAction === 'suspend') {
            router.patch(
                route('admin.providers.suspend', id),
                { suspension_reason: suspensionReason },
                opts
            );
        } else if (confirmAction === 'unsuspend') {
            router.patch(route('admin.providers.unsuspend', id), {}, opts);
        }
    };

    const providerName = provider.business_name || provider.user?.name || 'Tukang';
    const initial = providerName.charAt(0).toUpperCase();

    return (
        <AdminLayout title="Butiran tukang" breadcrumb="Pengurusan">
            <Head title={`${providerName} — Admin Tukang Perak`} />

            {/* ---------- Back link ---------- */}
            <Link
                href="/admin/providers"
                className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
            >
                <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                Kembali ke senarai tukang
            </Link>

            {/* ---------- Flash toast ---------- */}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                        ✓
                    </span>
                    <p className="text-sm font-medium text-emerald-800">{toast}</p>
                </div>
            )}

            {/* ============ HERO CARD ============ */}
            <div className="admin-card overflow-hidden">
                <div className="relative">
                    {/* Cover strip */}
                    <div className="h-24 bg-gradient-to-br from-[color:var(--green)] to-[color:var(--green-dark)]" />

                    <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
                        {/* Avatar overlapping the cover */}
                        <div className="-mt-12 mb-4 flex items-end justify-between gap-4">
                            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-[color:var(--lime)] text-3xl font-bold text-[color:var(--green-dark)] shadow-lg">
                                {provider.photo_path ? (
                                    <img
                                        src={`/storage/${provider.photo_path}`}
                                        alt={providerName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initial
                                )}
                            </div>

                            <div className="pb-1">
                                <StatusPill status={provider.status} />
                            </div>
                        </div>

                        {/* Name + meta */}
                        <h1 className="font-serif text-3xl tracking-tight text-[color:var(--ink)]">
                            {providerName}
                        </h1>

                        {provider.business_name && provider.business_name !== provider.user?.name && (
                            <p className="mt-1 text-sm text-[color:var(--muted)]">
                                Didaftarkan oleh{' '}
                                <span className="font-semibold text-[color:var(--ink)]">
                                    {provider.user?.name}
                                </span>
                            </p>
                        )}

                        {/* Category + district chips */}
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {provider.category && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--ink)]">
                                    <Icon.Wrench style={{ width: 12, height: 12, color: 'var(--green)' }} />
                                    {categoryLabels[provider.category] ?? provider.category}
                                </span>
                            )}
                            {provider.district && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--ink)]">
                                    <Icon.MapPin style={{ width: 12, height: 12, color: 'var(--green)' }} />
                                    {districtLabels[provider.district] ?? provider.district}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                                <Icon.Calendar style={{ width: 12, height: 12 }} />
                                Didaftar {formatDate(provider.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============ STATUS BANNER (contextual) ============ */}
            {provider.status === 'suspended' && provider.suspension_reason && (
                <div className="mt-5 flex items-start gap-4 rounded-2xl border border-stone-300 bg-stone-100 p-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-200 text-stone-700">
                        <Icon.Ban style={{ width: 18, height: 18 }} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900">
                            Akaun sedang digantung
                        </p>
                        <p className="mt-1 text-sm leading-6 text-stone-700">
                            {provider.suspension_reason}
                        </p>
                    </div>
                </div>
            )}

            {provider.status === 'rejected' && provider.rejection_reason && (
                <div className="mt-5 flex items-start gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                        <Icon.Alert style={{ width: 18, height: 18 }} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-rose-900">
                            Permohonan ditolak
                        </p>
                        <p className="mt-1 text-sm leading-6 text-rose-800/90">
                            {provider.rejection_reason}
                        </p>
                    </div>
                </div>
            )}

            {/* ============ MAIN GRID ============ */}
            <section className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                {/* LEFT: Details */}
                <div className="flex flex-col gap-6">
                    {/* Contact card */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Maklumat hubungan</h2>
                        </div>

                        <div className="admin-card__body">
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <DetailRow
                                    icon={<Icon.Mail style={{ width: 14, height: 14 }} />}
                                    label="E-mel"
                                    value={provider.user?.email ?? '—'}
                                    href={`mailto:${provider.user?.email}`}
                                />
                                <DetailRow
                                    icon={<Icon.Phone style={{ width: 14, height: 14 }} />}
                                    label="Telefon"
                                    value={provider.user?.phone_number ?? '—'}
                                    href={`tel:${provider.user?.phone_number}`}
                                />
                            </dl>
                        </div>
                    </div>

                    {/* Description card */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Penerangan</h2>
                        </div>

                        <div className="admin-card__body">
                            {provider.description ? (
                                <p className="whitespace-pre-line text-sm leading-6 text-[color:var(--ink)]">
                                    {provider.description}
                                </p>
                            ) : (
                                <p className="text-sm italic text-[color:var(--muted)]">
                                    Tiada penerangan diberikan.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex flex-col gap-6">
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Tindakan</h2>
                        </div>

                        <div className="admin-card__body space-y-2">
                            {provider.status === 'pending' && (
                                <>
                                    <ActionButton
                                        tone="green"
                                        icon={<Icon.Check style={{ width: 16, height: 16 }} />}
                                        title="Luluskan tukang"
                                        subtitle="Beri akses kepada tempahan"
                                        onClick={() => ask('approve')}
                                        disabled={processing}
                                    />
                                    <ActionButton
                                        tone="rose"
                                        icon={<Icon.X style={{ width: 16, height: 16 }} />}
                                        title="Tolak permohonan"
                                        subtitle="Tidak akan dapat menerima tempahan"
                                        onClick={() => ask('reject')}
                                        disabled={processing}
                                    />
                                </>
                            )}

                            {provider.status === 'approved' && (
                                <ActionButton
                                    tone="stone"
                                    icon={<Icon.Ban style={{ width: 16, height: 16 }} />}
                                    title="Gantung akaun"
                                    subtitle="Hentikan sementara akses tukang"
                                    onClick={() => ask('suspend')}
                                    disabled={processing}
                                />
                            )}

                            {provider.status === 'suspended' && (
                                <ActionButton
                                    tone="green"
                                    icon={<Icon.Refresh style={{ width: 16, height: 16 }} />}
                                    title="Aktifkan semula"
                                    subtitle="Pulihkan akses tukang"
                                    onClick={() => ask('unsuspend')}
                                    disabled={processing}
                                />
                            )}

                            {(provider.status === 'rejected') && (
                                <p className="rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3 text-xs leading-5 text-[color:var(--muted)]">
                                    Tukang ini telah ditolak. Mereka boleh
                                    memohon semula melalui dashboard mereka.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Verification meta */}
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Pengesahan</h2>
                        </div>
                        <div className="admin-card__body">
                            <div className="flex items-start gap-3">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Shield style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                                        Status semasa
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                                        {provider.status === 'approved' &&
                                            'Tukang ini telah disahkan dan boleh menerima tempahan.'}
                                        {provider.status === 'pending' &&
                                            'Permohonan sedang menunggu semakan manual.'}
                                        {provider.status === 'rejected' &&
                                            'Permohonan tidak diluluskan. Tukang boleh memohon semula.'}
                                        {provider.status === 'suspended' &&
                                            'Akses digantung sementara. Aktifkan semula untuk pulihkan.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CONFIRM MODAL ============ */}
            {confirmAction && (
                <ConfirmModal
                    action={confirmAction}
                    provider={provider}
                    processing={processing}
                    reason={suspensionReason}
                    onReasonChange={setSuspensionReason}
                    onCancel={() => {
                        if (processing) return;
                        setConfirmAction(null);
                        setSuspensionReason('');
                    }}
                    onConfirm={confirm}
                />
            )}
        </AdminLayout>
    );
}

/* ---------- Detail row ---------- */
function DetailRow({ icon, label, value, href }) {
    const content = (
        <span className="truncate font-semibold text-[color:var(--ink)] transition group-hover:text-[color:var(--green)]">
            {value}
        </span>
    );

    return (
        <div className="group flex items-start gap-3">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[color:var(--paper)] text-[color:var(--muted)]">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                    {label}
                </dt>
                <dd className="mt-0.5 truncate text-sm">
                    {href ? (
                        <a
                            href={href}
                            className="truncate font-semibold text-[color:var(--ink)] transition hover:text-[color:var(--green)]"
                        >
                            {value}
                        </a>
                    ) : (
                        <span className="font-semibold text-[color:var(--ink)]">
                            {value}
                        </span>
                    )}
                </dd>
            </div>
        </div>
    );
}

/* ---------- Action button ---------- */
function ActionButton({ tone, icon, title, subtitle, onClick, disabled }) {
    const toneClasses = {
        green: 'bg-[color:var(--green)] text-white hover:bg-[color:var(--green-dark)]',
        rose:  'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
        stone: 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50',
    }[tone];

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses}`}
        >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-black/5">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{title}</span>
                <span className="block text-xs opacity-80">{subtitle}</span>
            </span>
            <Icon.ArrowRight
                className="shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ width: 16, height: 16 }}
            />
        </button>
    );
}

/* ============================ CONFIRM MODAL ============================ */
function ConfirmModal({
    action,
    provider,
    processing,
    reason,
    onReasonChange,
    onCancel,
    onConfirm,
}) {
    const config = {
        approve: {
            icon: <Icon.Check style={{ width: 26, height: 26 }} />,
            tone: 'emerald',
            title: 'Luluskan tukang ini?',
            message: 'Tukang ini akan dapat mengakses tempahan dan menawarkan perkhidmatan mereka.',
            confirmLabel: 'Ya, luluskan',
        },
        reject: {
            icon: <Icon.Alert style={{ width: 26, height: 26 }} />,
            tone: 'rose',
            title: 'Tolak permohonan ini?',
            message: 'Tukang ini tidak akan dapat menerima tempahan. Mereka boleh memohon semula.',
            confirmLabel: 'Ya, tolak',
        },
        suspend: {
            icon: <Icon.Ban style={{ width: 26, height: 26 }} />,
            tone: 'rose',
            title: 'Gantung tukang ini?',
            message: 'Akaun akan digantung sementara. Tukang tidak boleh menerima tempahan baharu.',
            confirmLabel: 'Ya, gantung',
        },
        unsuspend: {
            icon: <Icon.Refresh style={{ width: 26, height: 26 }} />,
            tone: 'emerald',
            title: 'Aktifkan semula tukang ini?',
            message: 'Tukang akan kembali boleh menerima tempahan seperti biasa.',
            confirmLabel: 'Ya, aktifkan',
        },
    }[action];

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

    const requiresReason = action === 'suspend';
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
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${toneClasses.iconWrap}`}>
                        {config.icon}
                    </div>

                    <h2
                        id="confirm-modal-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                    >
                        {config.title}
                    </h2>

                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                            {provider.photo_path ? (
                                <img
                                    src={`/storage/${provider.photo_path}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                (provider.business_name || provider.user?.name)?.charAt(0) ?? 'T'
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                {provider.business_name || provider.user?.name}
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
                            <label
                                htmlFor="suspension_reason"
                                className="block text-xs font-bold uppercase tracking-wide text-[color:var(--muted)]"
                            >
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