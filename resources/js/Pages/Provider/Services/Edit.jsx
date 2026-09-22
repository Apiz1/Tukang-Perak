import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small icons ---------- */
const Icon = {
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
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
    Save: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 3h9l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
            <path d="M7 3v4h6M7 13h6" />
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
    Trash: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
};

/* ---------- Option lists ---------- */
const MAX_TITLE = 120;
const MAX_DESC = 1000;

/* 🆕 Matches controller: only 'fixed' and 'hourly' */
const priceTypeOptions = [
    { value: 'fixed',  label: 'Harga tetap',  hint: 'Satu harga untuk semua kerja' },
    { value: 'hourly', label: 'Mengikut jam', hint: 'Caj setiap jam kerja' },
];

/* 🆕 No 'quote' */
const priceTypeLabels = {
    fixed:  'Harga tetap',
    hourly: 'Mengikut jam',
};

const formatCurrency = (value) =>
    value === '' || value == null
        ? '—'
        : new Intl.NumberFormat('ms-MY', {
              style: 'currency',
              currency: 'MYR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
          }).format(value);

export default function Edit({ service }) {
    const { flash } = usePage().props;

    const [showConfirm, setShowConfirm] = useState(false);
    const [toast, setToast] = useState(null);

    /* Delete modal */
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { data, setData, patch, delete: destroy, processing, errors } = useForm({
        title:       service.title ?? '',
        description: service.description ?? '',
        price_type:  service.price_type ?? 'fixed',
        base_price:  service.base_price ?? '',
        is_active:   service.is_active ?? true,
    });

    /* Success toast from flash */
    useEffect(() => {
        if (flash?.status) {
            setToast(flash.status);
            const t = setTimeout(() => setToast(null), 4500);
            return () => clearTimeout(t);
        }
    }, [flash?.status]);

    /* Submit flow: form → modal → PATCH */
    const askSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        patch(route('provider.services.update', service.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowConfirm(false);
                setToast('Perubahan berjaya disimpan.');
                setTimeout(() => setToast(null), 4500);
            },
            onError: () => {
                setShowConfirm(false);
            },
        });
    };

    /* Delete flow */
    const confirmDelete = () => {
        destroy(route('provider.services.destroy', service.id), {
            onSuccess: () => {
                setShowDeleteConfirm(false);
            },
        });
    };

    return (
        <ProviderLayout title="Sunting perkhidmatan" breadcrumb="Perkhidmatan">
            <Head title={`Sunting ${service.title} — Tukang Perak`} />

            <div className="mx-auto w-full max-w-3xl">
                {/* Back link */}
                <Link
                    href="/provider/services"
                    className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--muted)] transition hover:text-[color:var(--green)]"
                >
                    <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                    Kembali ke senarai perkhidmatan
                </Link>

                {/* Flash toast */}
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

                {/* Header */}
                <div className="provider-page-header">
                    <p className="eyebrow">SUNTING PERKHIDMATAN</p>
                    <h1 className="provider-page-heading mt-3">
                        Kemas kini perkhidmatan anda.
                    </h1>
                    <p className="provider-page-subtitle">
                        Tukar nama, penerangan, harga atau status perkhidmatan ini.
                    </p>
                </div>

                <form onSubmit={askSubmit} className="space-y-6">
                    {/* ============ SERVICE INFO ============ */}
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Wrench style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="provider-card__title">
                                        Maklumat perkhidmatan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Nama dan penerangan ringkas
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="provider-card__body space-y-5">
                            {/* Title */}
                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-semibold text-[color:var(--ink)]"
                                    >
                                        Nama perkhidmatan
                                    </label>
                                    <span className="text-[11px] text-[color:var(--muted)]">
                                        {data.title.length}/{MAX_TITLE}
                                    </span>
                                </div>

                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    maxLength={MAX_TITLE}
                                    required
                                    placeholder="Contoh: Servis aircond rumah"
                                    className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                />

                                {errors.title && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-semibold text-[color:var(--ink)]"
                                    >
                                        Penerangan
                                    </label>
                                    <span className="text-[11px] text-[color:var(--muted)]">
                                        {data.description.length}/{MAX_DESC}
                                    </span>
                                </div>

                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={5}
                                    maxLength={MAX_DESC}
                                    placeholder="Ceritakan apa yang termasuk dalam perkhidmatan ini…"
                                    className="mt-2 w-full resize-none rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                />

                                {errors.description && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ============ PRICING ============ */}
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--warm)] text-[color:var(--ink)]">
                                    <Icon.Money style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="provider-card__title">Harga</h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Bagaimana anda ingin caj pelanggan
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="provider-card__body space-y-5">
                            {/* 🆕 Price type radios — 2 options */}
                            <div>
                                <label className="block text-sm font-semibold text-[color:var(--ink)]">
                                    Jenis harga
                                </label>

                                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                                    {priceTypeOptions.map((option) => {
                                        const selected =
                                            data.price_type === option.value;
                                        return (
                                            <label
                                                key={option.value}
                                                className={`group relative flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border p-3.5 transition-all duration-200 ${
                                                    selected
                                                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                                                        : 'border-stone-200 bg-stone-50 hover:border-emerald-200 hover:bg-white'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="price_type"
                                                    value={option.value}
                                                    checked={selected}
                                                    onChange={(e) =>
                                                        setData(
                                                            'price_type',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="sr-only"
                                                />

                                                <span className="flex w-full items-center justify-between">
                                                    <span
                                                        className={`text-sm font-semibold ${
                                                            selected
                                                                ? 'text-emerald-900'
                                                                : 'text-stone-800'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </span>

                                                    <span
                                                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition ${
                                                            selected
                                                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                                                : 'border-stone-300 bg-white'
                                                        }`}
                                                    >
                                                        {selected && (
                                                            <svg
                                                                viewBox="0 0 12 12"
                                                                className="h-2.5 w-2.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                </span>

                                                <span className="block text-xs text-stone-500">
                                                    {option.hint}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 🆕 Base price — always shown, always required */}
                            <div>
                                <label
                                    htmlFor="base_price"
                                    className="block text-sm font-semibold text-[color:var(--ink)]"
                                >
                                    {data.price_type === 'hourly'
                                        ? 'Kadar sejam'
                                        : 'Harga asas'}
                                </label>

                                <div className="relative mt-2">
                                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <span className="text-sm font-bold text-[color:var(--muted)]">
                                            RM
                                        </span>
                                        <span
                                            className="ml-2 h-4 w-px bg-[color:var(--line)]"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <input
                                        id="base_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.base_price}
                                        onChange={(e) =>
                                            setData('base_price', e.target.value)
                                        }
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-[color:var(--line)] bg-white py-3 pl-16 pr-4 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                    />
                                </div>

                                <p className="mt-2 text-xs text-[color:var(--muted)]">
                                    {data.price_type === 'hourly'
                                        ? 'Pelanggan akan melihat kadar ini semasa memilih anda.'
                                        : 'Harga permulaan — anda boleh berbincang dengan pelanggan kemudian.'}
                                </p>

                                {errors.base_price && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.base_price}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ============ VISIBILITY ============ */}
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <h2 className="provider-card__title">Keterlihatan</h2>
                        </div>

                        <div className="provider-card__body">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[color:var(--green)] focus:ring-[color:var(--green)]/30"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                                        Aktif — dipaparkan kepada pelanggan
                                    </p>
                                    <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                                        Bila dimatikan, perkhidmatan ini tidak akan
                                        muncul dalam carian atau boleh ditempah.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* ============ PREVIEW ============ */}
                    <div className="provider-card overflow-hidden">
                        <div className="provider-card__header">
                            <h2 className="provider-card__title">
                                Pratonton kepada pelanggan
                            </h2>
                        </div>

                        <div className="provider-card__body">
                            <div className="flex items-start gap-4">
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Wrench style={{ width: 20, height: 20 }} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                            {data.title || 'Nama perkhidmatan anda'}
                                        </p>
                                        <span
                                            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                                data.is_active
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-stone-200 bg-stone-100 text-stone-600'
                                            }`}
                                        >
                                            {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </div>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[color:var(--muted)]">
                                        {data.description ||
                                            'Penerangan akan muncul di sini.'}
                                    </p>
                                    {/* 🆕 Simplified price display */}
                                    <p className="mt-2 text-sm font-bold text-[color:var(--green-dark)]">
                                        {formatCurrency(data.base_price)}
                                        {data.price_type === 'hourly' && ' / jam'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============ ACTIONS ============ */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/provider/services"
                            className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)]"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--green)] px-6 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-[color:var(--green-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                        >
                            {processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    Simpan perubahan
                                    <Icon.ArrowRight
                                        className="transition-transform group-hover:translate-x-0.5"
                                        style={{ width: 14, height: 14 }}
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ============ DANGER ZONE ============ */}
                <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-700">
                                <Icon.Alert style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-rose-900">
                                    Padam perkhidmatan
                                </p>
                                <p className="mt-0.5 text-xs leading-5 text-rose-800/90">
                                    Tindakan ini tidak boleh dibatalkan.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={processing}
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                        >
                            <Icon.Trash style={{ width: 14, height: 14 }} />
                            Padam
                        </button>
                    </div>
                </div>
            </div>

            {/* ============ SAVE CONFIRM MODAL ============ */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-save-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !processing && setShowConfirm(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                <Icon.Save style={{ width: 24, height: 24 }} />
                            </div>

                            <h2
                                id="confirm-save-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                            >
                                Simpan perubahan?
                            </h2>

                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Wrench style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                        {data.title || 'Perkhidmatan'}
                                    </p>
                                    {/* 🆕 Simplified price display */}
                                    <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                        {priceTypeLabels[data.price_type] ??
                                            data.price_type}
                                        {data.base_price !== '' &&
                                            ` · ${formatCurrency(data.base_price)}${
                                                data.price_type === 'hourly'
                                                    ? ' / jam'
                                                    : ''
                                            }`}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                                Perubahan pada perkhidmatan ini akan disimpan.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSubmit}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--green)] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Ya, simpan'
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

            {/* ============ DELETE CONFIRM MODAL ============ */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-delete-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !processing && setShowDeleteConfirm(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                                <Icon.Alert style={{ width: 26, height: 26 }} />
                            </div>

                            <h2
                                id="confirm-delete-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                            >
                                Padam perkhidmatan ini?
                            </h2>

                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Wrench style={{ width: 16, height: 16 }} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                        {service.title}
                                    </p>
                                    {/* 🆕 Simplified price display */}
                                    <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                        {priceTypeLabels[service.price_type] ??
                                            service.price_type}
                                        {' · '}
                                        {formatCurrency(service.base_price)}
                                        {service.price_type === 'hourly' && ' / jam'}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                                Perkhidmatan ini akan dipadamkan secara kekal.
                                Tindakan ini tidak boleh dibatalkan.
                            </p>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Memadam...
                                        </>
                                    ) : (
                                        'Ya, padam'
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
        </ProviderLayout>
    );
}