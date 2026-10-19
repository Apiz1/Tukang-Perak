// resources/js/Pages/Provider/Gallery/Index.jsx
import ProviderLayout from '@/Layouts/ProviderLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ---------- Small icons ---------- */
const Icon = {
    Image: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4" width="14" height="12" rx="2" />
            <circle cx="7.5" cy="8.5" r="1.2" />
            <path d="M3 14l4-4 3 3 3-3 4 4" />
        </svg>
    ),
    Upload: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 14V4M6 8l4-4 4 4" />
            <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
        </svg>
    ),
    Trash: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 6h12M8 3h4M6 6v10a1 1 0 001 1h6a1 1 0 001-1V6" />
            <path d="M9 10v4M11 10v4" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    Plus: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 4v12M4 10h12" />
        </svg>
    ),
};

/* ---------- Helpers ---------- */
const MAX_PER_UPLOAD = 10;

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatFileSize = (bytes) => {
    if (bytes == null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ============================ PAGE ============================ */
export default function Index({ photos = [], max = 20 }) {
    const fileInputRef = useRef(null);
    const [deletingId, setDeletingId] = useState(null);
    const [previewUrls, setPreviewUrls] = useState([]);

    /* 🆕 Delete confirmation state */
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, setData, post, processing, progress, errors, reset } = useForm({
        photos: [],
    });

    const usedCount = photos.length;
    const remaining = Math.max(0, max - usedCount);
    const isFull = remaining === 0;

    /* ---------- Select files (with client-side validation) ---------- */
    const handleFiles = (e) => {
        const files = Array.from(e.target.files ?? []);

        if (files.length === 0) {
            setData('photos', []);
            setPreviewUrls([]);
            return;
        }

        /* Cap to remaining slots */
        const allowed = files.slice(0, remaining);
        setData('photos', allowed);

        /* Local preview URLs */
        setPreviewUrls(allowed.map((f) => URL.createObjectURL(f)));
    };

    /* ---------- Clear selected files ---------- */
    const clearSelection = () => {
        reset('photos');
        setPreviewUrls([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /* ---------- Submit upload ---------- */
    const submit = (e) => {
        e.preventDefault();
        if (data.photos.length === 0) return;

        post(route('provider.gallery.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                clearSelection();
            },
        });
    };

    /* ---------- 🆕 Delete flow: ask → modal → confirm ---------- */
    const askRemove = (photo) => {
        setDeleteTarget(photo);
    };

    const confirmRemove = () => {
        if (!deleteTarget) return;
        const id = deleteTarget.id;
        setDeletingId(id);

        router.delete(route('provider.gallery.destroy', id), {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <ProviderLayout title="Galeri kerja" breadcrumb="Galeri">
            <Head title="Galeri kerja — Tukang Perak" />

            {/* ============ PAGE HEADER ============ */}
            <div className="provider-page-header">
                <p className="eyebrow">GALERI</p>
                <h1 className="provider-page-heading mt-3">
                    Galeri kerja.
                </h1>
                <p className="provider-page-subtitle">
                    Tunjukkan hasil kerja anda kepada pelanggan. Gambar yang
                    jelas meningkatkan keyakinan dan peluang anda dipilih.
                </p>
            </div>

            {/* ============ QUOTA STAT ============ */}
            <section className="grid gap-4 sm:grid-cols-2">
                <div className="provider-stat">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="provider-stat__label">Gambar dimuat naik</p>
                            <p className="provider-stat__value">{usedCount}</p>
                            <p className="mt-1 text-xs text-[color:var(--muted)]">
                                Daripada {max} gambar dibenarkan
                            </p>
                        </div>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Image style={{ width: 18, height: 18 }} />
                        </span>
                    </div>
                </div>

                <div className="provider-stat">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="provider-stat__label">Baki slot</p>
                            <p className="provider-stat__value">{remaining}</p>
                            <p className="mt-1 text-xs text-[color:var(--muted)]">
                                {isFull
                                    ? 'Galeri anda penuh — padam gambar untuk muat naik baharu'
                                    : 'Boleh muat naik lebih banyak gambar'}
                            </p>
                        </div>
                        <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                                isFull
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-emerald-50 text-emerald-700'
                            }`}
                        >
                            {isFull ? (
                                <Icon.Alert style={{ width: 18, height: 18 }} />
                            ) : (
                                <Icon.Check style={{ width: 18, height: 18 }} />
                            )}
                        </span>
                    </div>
                </div>
            </section>

            {/* ============ UPLOAD CARD ============ */}
            <form onSubmit={submit} className="mt-6 provider-card">
                <div className="border-b border-[color:var(--line)] px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                            <Icon.Upload style={{ width: 16, height: 16 }} />
                        </span>
                        <div>
                            <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                Muat naik gambar
                            </h2>
                            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                JPG, PNG, atau WebP · maksimum{' '}
                                {MAX_PER_UPLOAD} fail setiap muat naik
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    {/* File picker */}
                    {isFull ? (
                        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-700">
                                <Icon.Alert style={{ width: 14, height: 14 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-rose-900">
                                    Galeri anda sudah penuh
                                </p>
                                <p className="mt-1 text-xs leading-5 text-rose-800/90">
                                    Padam gambar sedia ada di bawah untuk
                                    membebaskan slot sebelum memuat naik yang
                                    baharu.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label
                                    htmlFor="photos"
                                    className="block text-sm font-semibold text-[color:var(--ink)]"
                                >
                                    Pilih gambar
                                </label>
                                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                    Anda boleh pilih sehingga {remaining} gambar
                                    dalam satu masa
                                </p>

                                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        id="photos"
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={handleFiles}
                                        className="block w-full cursor-pointer rounded-xl border border-[color:var(--line)] bg-white text-sm text-[color:var(--ink)] file:mr-3 file:border-0 file:bg-[color:var(--lime)] file:px-4 file:py-3 file:text-sm file:font-bold file:text-[color:var(--green-dark)] hover:file:bg-[#d8eece] focus:outline-none focus:ring-2 focus:ring-[color:var(--green)]/15"
                                    />

                                    {data.photos.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearSelection}
                                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[color:var(--line)] bg-white px-3.5 py-2.5 text-xs font-bold text-[color:var(--muted)] transition hover:border-stone-300 hover:text-[color:var(--ink)]"
                                        >
                                            <Icon.Image style={{ width: 12, height: 12 }} />
                                            Kosongkan
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Selected-file previews */}
                            {data.photos.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--muted)]">
                                        Dipilih ({data.photos.length})
                                    </p>

                                    <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {data.photos.map((file, i) => (
                                            <li
                                                key={`${file.name}-${i}`}
                                                className="overflow-hidden rounded-xl border border-[color:var(--line)] bg-white"
                                            >
                                                <div className="aspect-square overflow-hidden bg-[color:var(--paper)]">
                                                    {previewUrls[i] && (
                                                        <img
                                                            src={previewUrls[i]}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="p-2">
                                                    <p className="truncate text-[11px] font-semibold text-[color:var(--ink)]">
                                                        {file.name}
                                                    </p>
                                                    <p className="mt-0.5 text-[10px] text-[color:var(--muted)]">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Global photos error */}
                            {errors.photos && (
                                <p className="text-xs font-semibold text-rose-600">
                                    {errors.photos}
                                </p>
                            )}

                            {/* Per-file errors */}
                            {Object.keys(errors ?? {})
                                .filter((k) => k.startsWith('photos.'))
                                .map((key) => (
                                    <p
                                        key={key}
                                        className="text-xs font-semibold text-rose-600"
                                    >
                                        Fail #{Number(key.split('.')[1]) + 1}:{' '}
                                        {errors[key]}
                                    </p>
                                ))}

                            {/* Progress bar */}
                            {processing && progress && typeof progress.percentage === 'number' && (
                                <div>
                                    <div className="flex items-center justify-between text-[11px] text-[color:var(--muted)]">
                                        <span>Memuat naik…</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[color:var(--paper)]">
                                        <div
                                            className="h-full rounded-full bg-[color:var(--green)] transition-all duration-200"
                                            style={{ width: `${progress.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit */}
                            <div className="flex flex-col-reverse gap-3 border-t border-[color:var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || data.photos.length === 0}
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--green)] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[color:var(--green-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Memuat naik...
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Upload style={{ width: 14, height: 14 }} />
                                            Muat naik
                                            {data.photos.length > 0 &&
                                                ` (${data.photos.length})`}
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </form>

            {/* ============ PHOTO GRID ============ */}
            <div className="mt-8 provider-card">
                <div className="border-b border-[color:var(--line)] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-bold text-[color:var(--ink)]">
                                Gambar galeri
                            </h2>
                            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                {usedCount > 0
                                    ? `${usedCount} gambar dipaparkan di profil awam anda`
                                    : 'Belum ada gambar'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    {photos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                <Icon.Image style={{ width: 24, height: 24 }} />
                            </span>
                            <p className="text-sm font-semibold text-[color:var(--ink)]">
                                Belum ada gambar dimuat naik
                            </p>
                            <p className="max-w-xs text-xs leading-5 text-[color:var(--muted)]">
                                Muat naik gambar hasil kerja anda di atas untuk
                                dipaparkan di sini dan pada profil awam.
                            </p>
                        </div>
                    ) : (
                        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {photos.map((photo) => (
                                <li
                                    key={photo.id}
                                    className="group relative overflow-hidden rounded-xl border border-[color:var(--line)] bg-white transition hover:border-[color:var(--green)]/40 hover:shadow-sm"
                                >
                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden bg-[color:var(--paper)]">
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt=""
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Meta + delete */}
                                    <div className="flex items-center justify-between gap-2 border-t border-[color:var(--line)] px-2.5 py-2">
                                        <span className="truncate text-[10px] text-[color:var(--muted)]">
                                            {photo.created_at
                                                ? formatDate(photo.created_at)
                                                : ''}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => askRemove(photo)}
                                            disabled={deletingId === photo.id}
                                            aria-label="Padam gambar"
                                            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {deletingId === photo.id ? (
                                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-rose-300 border-t-rose-700" />
                                            ) : (
                                                <Icon.Trash
                                                    style={{ width: 12, height: 12 }}
                                                />
                                            )}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* 🆕 ============ DELETE CONFIRM MODAL ============ */}
            {deleteTarget && (
                <DeleteModal
                    photo={deleteTarget}
                    processing={deletingId === deleteTarget.id}
                    onCancel={() => {
                        if (deletingId) return;
                        setDeleteTarget(null);
                    }}
                    onConfirm={confirmRemove}
                />
            )}
        </ProviderLayout>
    );
}

/* 🆕 ============================ DELETE MODAL ============================ */
function DeleteModal({ photo, processing, onCancel, onConfirm }) {
    useEffect(() => {
        const onKey = (e) => {
            if (processing) return;
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter') onConfirm();
        };
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onCancel, onConfirm, processing]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-gallery-title"
        >
            <div
                className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[color:var(--line)] bg-white shadow-2xl shadow-stone-900/20">
                <div className="p-7 sm:p-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                        <Icon.Trash style={{ width: 26, height: 26 }} />
                    </div>

                    <h2
                        id="delete-gallery-title"
                        className="mt-5 text-center font-serif text-2xl tracking-tight text-[color:var(--ink)]"
                    >
                        Padam gambar ini?
                    </h2>

                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)]/60 p-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-[color:var(--paper)]">
                            {photo?.path ? (
                                <img
                                    src={`/storage/${photo.path}`}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Icon.Image
                                    style={{ width: 16, height: 16 }}
                                    className="text-[color:var(--muted)]"
                                />
                            )}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                Gambar galeri
                            </p>
                            <p className="truncate text-xs text-[color:var(--muted)]">
                                {photo?.created_at
                                    ? formatDate(photo.created_at)
                                    : 'Dipaparkan di profil awam'}
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm leading-6 text-[color:var(--muted)]">
                        Gambar ini akan dipadam secara kekal daripada galeri anda
                        dan{' '}
                        <span className="font-bold text-rose-700">
                            tidak boleh dipulihkan
                        </span>
                        .
                    </p>

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
    );
}