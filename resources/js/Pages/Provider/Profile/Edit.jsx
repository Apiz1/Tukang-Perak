import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small icons ---------- */
const Icon = {
    Camera: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 7.5a2 2 0 012-2h1.2l.9-1.5h5.8l.9 1.5H15a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" />
            <circle cx="10" cy="10.5" r="3" />
        </svg>
    ),
    Upload: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 14V4M6 8l4-4 4 4M4 16h12" />
        </svg>
    ),
    Trash: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
        </svg>
    ),
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        </svg>
    ),
    Info: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 9v5M10 6.2h.01" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    Save: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 3h9l3 3v11a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" />
            <path d="M7 3v4h6M7 13h6" />
        </svg>
    ),
};

/* ---------- Limits ---------- */
const MAX_NAME = 80;
const MAX_DESC = 500;

export default function Edit({ providerProfile }) {
    const { flash } = usePage().props;

    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    /* 🆕 Confirmation modal state */
    const [showConfirm, setShowConfirm] = useState(false);

    /* 🆕 Success toast state */
    const [toast, setToast] = useState(null);

    const { data, setData, post, processing, errors, progress, isDirty } = useForm({
        business_name: providerProfile?.business_name ?? '',
        description:   providerProfile?.description ?? '',
        photo:         null,
        _method:       'patch',
    });

    /* Clean up object URL on unmount / change */
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    /* 🆕 Show toast when Laravel flashes a status message */
    useEffect(() => {
        if (flash?.status) {
            setToast({ type: 'success', message: flash.status });
            const t = setTimeout(() => setToast(null), 4500);
            return () => clearTimeout(t);
        }
    }, [flash?.status]);

    /* File selection → preview */
    const handleFile = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
        setData('photo', file);
    };

    const clearFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setData('photo', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /* 🆕 Submit form now opens the confirmation modal instead of posting */
    const askSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    /* 🆕 Fires after the user confirms */
    const confirmSubmit = () => {
        post(route('provider.profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setShowConfirm(false);

                // Fallback toast in case Laravel doesn't flash a status
                setToast({ type: 'success', message: 'Profil berjaya dikemas kini.' });
                setTimeout(() => setToast(null), 4500);
            },
            onError: () => {
                // Close the modal so the user can see field errors
                setShowConfirm(false);
            },
        });
    };

    const displayImage = previewUrl
        ? previewUrl
        : providerProfile?.photo_path
        ? `/storage/${providerProfile.photo_path}`
        : null;

    const businessInitial = data.business_name?.charAt(0)?.toUpperCase() || 'T';

    return (
        <ProviderLayout title="Profil tukang" breadcrumb="Akaun">
            <Head title="Profil tukang — Tukang Perak" />

            <div className="mx-auto w-full max-w-3xl">
                {/* ---------- Inline flash (kept) ---------- */}
                {flash?.status && (
                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-700 text-[11px] font-bold text-white">
                            ✓
                        </span>
                        <p className="text-sm font-medium text-emerald-800">
                            {flash.status}
                        </p>
                    </div>
                )}

                {/* ---------- Header ---------- */}
                <div className="provider-page-header">
                    <p className="eyebrow">PROFIL</p>
                    <h1 className="provider-page-heading mt-3">
                        Kemas kini profil anda.
                    </h1>
                    <p className="provider-page-subtitle">
                        Maklumat yang jelas dan gambar profesional membantu pelanggan
                        lebih yakin untuk memilih anda.
                    </p>
                </div>

                <form
                    onSubmit={askSubmit}
                    encType="multipart/form-data"
                    className="space-y-6"
                >
                    {/* ============ PHOTO ============ */}
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Camera style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="provider-card__title">
                                        Gambar perniagaan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        JPG atau PNG, saiz maksimum 2MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="provider-card__body">
                            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                                <div className="relative">
                                    <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper)] text-2xl font-bold text-[color:var(--green-dark)]">
                                        {displayImage ? (
                                            <img
                                                src={displayImage}
                                                alt="Gambar perniagaan"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            businessInitial
                                        )}
                                    </div>
                                    {previewUrl && (
                                        <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[color:var(--green)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                            Baharu
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <input
                                        ref={fileInputRef}
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFile}
                                        className="sr-only"
                                    />

                                    <div className="flex flex-wrap items-center gap-2">
                                        <label
                                            htmlFor="photo"
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-bold text-[color:var(--ink)] transition hover:border-[#a9cdb4] hover:text-[color:var(--green)]"
                                        >
                                            <Icon.Upload style={{ width: 14, height: 14 }} />
                                            Pilih gambar
                                        </label>

                                        {previewUrl && (
                                            <button
                                                type="button"
                                                onClick={clearFile}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                                            >
                                                <Icon.Trash style={{ width: 12, height: 12 }} />
                                                Buang
                                            </button>
                                        )}
                                    </div>

                                    <p className="mt-2 text-xs text-[color:var(--muted)]">
                                        Gambar persegi berukuran 400×400 atau lebih
                                        besar memberi paparan terbaik.
                                    </p>

                                    {progress && (
                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[color:var(--paper)]">
                                            <div
                                                className="h-full rounded-full bg-[color:var(--green)] transition-all"
                                                style={{ width: `${progress.percentage}%` }}
                                            />
                                        </div>
                                    )}

                                    {errors.photo && (
                                        <p className="mt-2 text-xs font-semibold text-rose-600">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ============ BUSINESS INFO ============ */}
                    <div className="provider-card">
                        <div className="provider-card__header">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--warm)] text-[color:var(--ink)]">
                                    <Icon.User style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="provider-card__title">
                                        Maklumat perniagaan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        Bagaimana pelanggan mengenali anda
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="provider-card__body space-y-5">
                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label
                                        htmlFor="business_name"
                                        className="block text-sm font-semibold text-[color:var(--ink)]"
                                    >
                                        Nama perniagaan
                                    </label>
                                    <span className="text-[11px] text-[color:var(--muted)]">
                                        {data.business_name.length}/{MAX_NAME}
                                    </span>
                                </div>

                                <input
                                    id="business_name"
                                    type="text"
                                    value={data.business_name}
                                    onChange={(e) =>
                                        setData('business_name', e.target.value)
                                    }
                                    maxLength={MAX_NAME}
                                    required
                                    placeholder="Contoh: Kedai Servis Aircond Ali"
                                    className="mt-2 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm text-[color:var(--ink)] placeholder-[color:var(--muted)] outline-none transition focus:border-[color:var(--green)] focus:ring-2 focus:ring-[color:var(--green)]/15"
                                />

                                {errors.business_name && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.business_name}
                                    </p>
                                )}
                            </div>

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
                                    placeholder="Ceritakan tentang pengalaman, kepakaran, dan jenis kerja yang anda tawarkan…"
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

                    {/* ============ TIP ============ */}
                    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                <Icon.Info style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-[color:var(--ink)]">
                                    Tip untuk profil yang menarik
                                </p>
                                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-[color:var(--muted)]">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Gunakan nama perniagaan yang jelas dan mudah diingati.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Senaraikan kepakaran anda: jenis kerja, jenama,
                                        dan kawasan liputan.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--green)]" />
                                        Muat naik gambar kerja atau logo yang jelas.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ============ ACTIONS ============ */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href="/provider/dashboard"
                            className="inline-flex items-center justify-center rounded-xl border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink)] transition hover:border-stone-300 hover:bg-[color:var(--paper)]"
                        >
                            Kembali ke papan pemuka
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
                                    Simpan profil
                                    <Icon.ArrowRight
                                        className="transition-transform group-hover:translate-x-0.5"
                                        style={{ width: 14, height: 14 }}
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ============ VERIFICATION FOOTER ============ */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 p-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                        <Icon.Shield style={{ width: 16, height: 16 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                            Perubahan pada profil boleh menjejaskan status pengesahan
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                            Jika akaun anda sudah disahkan dan anda menukar
                            maklumat penting, admin mungkin akan menyemak semula
                            profil anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* ============ CONFIRM SAVE MODAL ============ */}
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

                            <p className="mt-3 text-center text-sm leading-6 text-[color:var(--muted)]">
                                Perubahan pada profil anda akan disimpan. Anda
                                boleh mengemas kini semula pada bila-bila masa.
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
                        </div>
                    </div>
                </div>
            )}

            {/* ============ SUCCESS TOAST ============ */}
            {toast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="pointer-events-none fixed bottom-6 right-6 z-[200] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-900/10"
                    style={{ animation: 'toastIn 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-700 text-white">
                        <Icon.Check style={{ width: 16, height: 16 }} />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-[color:var(--ink)]">
                            Berjaya!
                        </p>
                        <p className="mt-0.5 text-xs leading-5 text-[color:var(--muted)]">
                            {toast.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Scoped animation keyframes */}
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </ProviderLayout>
    );
}