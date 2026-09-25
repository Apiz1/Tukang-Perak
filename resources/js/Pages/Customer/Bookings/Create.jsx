import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';

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
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Pin: (p) => (
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
    Clock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 1.8" />
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

/* ---------- Static label maps ---------- */
const districtOptions = [
    { value: 'parit_buntar',  label: 'Parit Buntar' },
    { value: 'kuala_kangsar', label: 'Kuala Kangsar' },
    { value: 'taiping',       label: 'Taiping' },
    { value: 'ipoh',          label: 'Ipoh' },
    { value: 'teluk_intan',   label: 'Teluk Intan' },
];

const priceTypeLabels = {
    fixed:  'Harga tetap',
    hourly: 'Mengikut jam',
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

const formatServicePrice = (service) => {
    if (service?.base_price == null) return '—';
    const base = formatCurrency(service.base_price);
    return service.price_type === 'hourly' ? `${base} / jam` : base;
};

const getProviderName = (service) =>
    service?.provider_profile?.business_name ??
    service?.provider_profile?.user?.name ??
    'Tukang';

const getProviderPhoto = (service) =>
    service?.provider_profile?.photo_path
        ? `/storage/${service.provider_profile.photo_path}`
        : null;

const getProviderInitial = (service) =>
    getProviderName(service).charAt(0).toUpperCase();

/* ---------- Limits ---------- */
const MAX_ADDRESS = 1000;
const MAX_NOTES = 2000;

/* ============================ PAGE ============================ */
export default function Create({ service }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        preferred_date: '',
        district: '',
        address: '',
        notes: '',
    });

    const providerName = getProviderName(service);
    const providerPhoto = getProviderPhoto(service);

    /* Minimum selectable date = today */
    const today = new Date().toISOString().split('T')[0];

    /* Submit flow: form → modal → POST */
    const askSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        post(route('services.book.store', service.id), {
            preserveScroll: true,
            onSuccess: () => setShowConfirm(false),
            onError: () => setShowConfirm(false),
        });
    };

    return (
        <MainLayout>
            <Head title={`Tempah ${service.title} — Tukang Perak`} />

            <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
                {/* Back link */}
                <Link
                    href={`/providers/${service.provider_profile?.id ?? ''}`}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
                >
                    <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                    Kembali ke profil tukang
                </Link>

                {/* Header */}
                <div className="provider-page-header">
                    <p className="eyebrow">TEMPAHAN BAHARU</p>
                    <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900">
                        Hantar permintaan tempahan.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                        Isi butiran di bawah. Tukang akan mengesahkan tempahan
                        anda sebelum kerja dimulakan.
                    </p>
                </div>

                {/* ============ SERVICE SUMMARY ============ */}
                <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        {/* Provider avatar */}
                        <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
                            {providerPhoto ? (
                                <img
                                    src={providerPhoto}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getProviderInitial(service)
                            )}
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-stone-900">
                                {service.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                {providerName}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-bold text-emerald-700">
                                    {formatServicePrice(service)}
                                </span>
                                <span className="text-stone-400">·</span>
                                <span className="text-stone-500">
                                    {priceTypeLabels[service.price_type] ??
                                        service.price_type}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============ FORM ============ */}
                <form onSubmit={askSubmit} className="mt-6 space-y-6">
                    {/* ---------- Booking details ---------- */}
                    <div className="rounded-2xl border border-stone-200 bg-white">
                        <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                                    <Icon.Calendar style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="text-sm font-bold text-stone-900">
                                        Butiran tempahan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-stone-500">
                                        Tarikh dan kawasan kerja
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            {/* Preferred date */}
                            <div>
                                <label
                                    htmlFor="preferred_date"
                                    className="block text-sm font-semibold text-stone-800"
                                >
                                    Tarikh pilihan
                                </label>

                                <input
                                    id="preferred_date"
                                    type="date"
                                    value={data.preferred_date}
                                    min={today}
                                    onChange={(e) =>
                                        setData('preferred_date', e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                />

                                {errors.preferred_date && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.preferred_date}
                                    </p>
                                )}
                            </div>

                            {/* District */}
                            <div>
                                <label
                                    htmlFor="district"
                                    className="block text-sm font-semibold text-stone-800"
                                >
                                    Daerah
                                </label>

                                <select
                                    id="district"
                                    value={data.district}
                                    onChange={(e) =>
                                        setData('district', e.target.value)
                                    }
                                    required
                                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                >
                                    <option value="">Pilih daerah</option>
                                    {districtOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                {errors.district && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.district}
                                    </p>
                                )}
                            </div>

                            {/* Full address */}
                            <div>
                                <div className="flex items-baseline justify-between gap-3">
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-semibold text-stone-800"
                                    >
                                        Alamat penuh
                                    </label>
                                    <span className="text-[11px] text-stone-500">
                                        {data.address.length}/{MAX_ADDRESS}
                                    </span>
                                </div>

                                <textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    rows={3}
                                    maxLength={MAX_ADDRESS}
                                    required
                                    placeholder="No. rumah, jalan, taman, poskod…"
                                    className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                />

                                {errors.address && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ---------- Notes ---------- */}
                    <div className="rounded-2xl border border-stone-200 bg-white">
                        <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700">
                                    <Icon.Info style={{ width: 16, height: 16 }} />
                                </span>
                                <div>
                                    <h2 className="text-sm font-bold text-stone-900">
                                        Nota tambahan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-stone-500">
                                        Pilihan, tetapi membantu tukang
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-6">
                            <div className="flex items-baseline justify-between gap-3">
                                <label
                                    htmlFor="notes"
                                    className="block text-sm font-semibold text-stone-800"
                                >
                                    Terangkan masalah atau arahan khas
                                </label>
                                <span className="text-[11px] text-stone-500">
                                    {data.notes.length}/{MAX_NOTES}
                                </span>
                            </div>

                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                maxLength={MAX_NOTES}
                                placeholder="Contoh: Aircond tidak sejuk sejak semalam, ada bunyi pelik…"
                                className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            />

                            {errors.notes && (
                                <p className="mt-2 text-xs font-semibold text-rose-600">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ---------- Safety reminder ---------- */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                                <Icon.Shield style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-stone-900">
                                    Sebelum menghantar
                                </p>
                                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Sahkan skop kerja dan harga dengan tukang.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Pastikan alamat tepat untuk elak kelewatan.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Hantar tempahan sekurang-kurangnya 2 hari
                                        lebih awal.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ---------- Actions ---------- */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href={`/providers/${service.provider_profile?.id ?? ''}`}
                            className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Menghantar...
                                </>
                            ) : (
                                <>
                                    Hantar permintaan
                                    <Icon.ArrowRight
                                        className="transition-transform group-hover:translate-x-0.5"
                                        style={{ width: 14, height: 14 }}
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ============ CONFIRM MODAL ============ */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-book-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !processing && setShowConfirm(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <Icon.Save style={{ width: 24, height: 24 }} />
                            </div>

                            <h2
                                id="confirm-book-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-stone-900"
                            >
                                Hantar permintaan?
                            </h2>

                            <p className="mt-3 text-center text-sm leading-6 text-stone-600">
                                Tukang akan menerima permintaan anda dan
                                mengesahkannya. Anda boleh pantau status di
                                halaman Tempahan Saya.
                            </p>

                            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                <p className="text-xs font-semibold text-stone-700">
                                    {service.title}
                                </p>
                                <p className="mt-0.5 text-xs text-stone-500">
                                    {providerName}
                                </p>
                                {data.preferred_date && (
                                    <p className="mt-1 text-xs text-stone-500">
                                        📅{' '}
                                        {new Date(data.preferred_date).toLocaleDateString(
                                            'ms-MY',
                                            {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            }
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmSubmit}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menghantar...
                                        </>
                                    ) : (
                                        'Ya, hantar'
                                    )}
                                </button>
                            </div>

                            <p className="mt-4 text-center text-[10px] uppercase tracking-wide text-stone-500">
                                Tekan ESC untuk batal
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}