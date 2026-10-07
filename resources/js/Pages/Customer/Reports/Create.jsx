// resources/js/Pages/Customer/Reports/Create.jsx
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
    Flag: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 3v14" />
            <path d="M4 4h9l-1.5 3L13 10H4" />
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
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    X: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 5l10 10M15 5L5 15" />
        </svg>
    ),
};

/* ---------- Static label maps ---------- */
const categoryLabels = {
    aircon: 'Aircond',
    plumbing: 'Paip',
    cleaning: 'Pembersihan',
    electrical: 'Elektrik',
};

const districtLabels = {
    parit_buntar:  'Parit Buntar',
    kuala_kangsar: 'Kuala Kangsar',
    taiping:       'Taiping',
    ipoh:          'Ipoh',
    teluk_intan:   'Teluk Intan',
};

const reasonLabels = {
    harassment:    'Gangguan / ugutan',
    no_show:       'Tukang tidak hadir',
    scam:          'Penipuan / scam',
    inappropriate: 'Tingkah laku tidak wajar',
    other:         'Lain-lain',
};

/* ---------- Helpers ---------- */
const getProviderName = (provider) =>
    provider?.user?.name ??
    provider?.business_name ??
    'Tukang';

const getProviderInitial = (provider) =>
    getProviderName(provider).charAt(0).toUpperCase();

const getProviderPhoto = (provider) =>
    provider?.photo_path ? `/storage/${provider.photo_path}` : null;

const getCategoryLabel = (v) => categoryLabels[v] ?? v ?? '—';
const getDistrictLabel = (v) => districtLabels[v] ?? v ?? 'Perak';

const getReasonLabel = (reason) => {
    if (typeof reason === 'string') {
        return reasonLabels[reason] ?? reason;
    }
    return (
        reason.label ??
        reason.name ??
        reasonLabels[reason.value ?? reason.slug] ??
        reason.value ??
        reason.slug
    );
};

const getReasonValue = (reason) => {
    if (typeof reason === 'string') return reason;
    return reason.value ?? reason.slug;
};

/* ============================ PAGE ============================ */
export default function Create({ provider, reasons = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
        details: '',
    });

    /* 🆕 Confirmation modal state */
    const [showConfirm, setShowConfirm] = useState(false);

    /* Submit handler — triggered by the form */
    const submit = (e) => {
        e.preventDefault();

        // First click: open the confirmation modal
        // Second click (from modal): actually send
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }
    };

    /* 🆕 Called when the user confirms in the modal */
    const confirmSubmit = () => {
        post(route('customer.providers.report.store', provider.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowConfirm(false);
            },
            onError: () => {
                // Keep the modal closed if the server rejects; the
                // inline error messages will render on the form.
                setShowConfirm(false);
            },
        });
    };

    const providerName = getProviderName(provider);
    const providerPhoto = getProviderPhoto(provider);

    const canSubmit = data.reason && data.details;

    return (
        <MainLayout>
            <Head title={`Laporkan ${providerName} — Tukang Perak`} />

            <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
                {/* Back link */}
                <Link
                    href={route('providers.show', provider.id)}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
                >
                    <Icon.ArrowLeft style={{ width: 14, height: 14 }} />
                    Kembali ke profil tukang
                </Link>

                {/* ============ PAGE HEADER ============ */}
                <div className="mb-8">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600">
                        <span className="h-px w-5 bg-rose-600" />
                        LAPORAN
                    </p>
                    <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
                        Laporkan {providerName}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
                        Beritahu kami apa yang berlaku. Pasukan sokongan kami
                        akan menyemak laporan anda dan mengambil tindakan yang
                        sewajarnya.
                    </p>
                </div>

                {/* ============ PROVIDER SUMMARY ============ */}
                <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-emerald-100 text-base font-bold text-emerald-800">
                            {providerPhoto ? (
                                <img
                                    src={providerPhoto}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getProviderInitial(provider)
                            )}
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                                Tukang dilaporkan
                            </p>
                            <h2 className="mt-1 truncate text-base font-bold text-stone-900">
                                {providerName}
                            </h2>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500">
                                {provider?.category && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Icon.Wrench style={{ width: 12, height: 12 }} />
                                        {getCategoryLabel(provider.category)}
                                    </span>
                                )}
                                {provider?.district && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Icon.Pin style={{ width: 12, height: 12 }} />
                                        {getDistrictLabel(provider.district)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============ REPORT FORM ============ */}
                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-stone-200 bg-white"
                >
                    <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-700">
                                <Icon.Flag style={{ width: 16, height: 16 }} />
                            </span>
                            <div>
                                <h2 className="text-sm font-bold text-stone-900">
                                    Butiran laporan
                                </h2>
                                <p className="mt-0.5 text-xs text-stone-500">
                                    Semua maklumat adalah sulit
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-5 sm:p-6">
                        {/* Reason */}
                        <div>
                            <label
                                htmlFor="reason"
                                className="block text-sm font-semibold text-stone-800"
                            >
                                Sebab laporan
                            </label>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Pilih sebab yang paling sesuai
                            </p>

                            <select
                                id="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                required
                                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            >
                                <option value="">— Pilih sebab —</option>
                                {reasons.map((reason) => (
                                    <option
                                        key={getReasonValue(reason)}
                                        value={getReasonValue(reason)}
                                    >
                                        {getReasonLabel(reason)}
                                    </option>
                                ))}
                            </select>

                            {errors.reason && (
                                <p className="mt-2 text-xs font-semibold text-rose-600">
                                    {errors.reason}
                                </p>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-baseline justify-between gap-3">
                                <label
                                    htmlFor="details"
                                    className="block text-sm font-semibold text-stone-800"
                                >
                                    Butiran lanjut
                                </label>
                                <span className="text-[11px] text-stone-500">
                                    {data.details.length}/2000
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-stone-500">
                                Terangkan apa yang berlaku dengan lebih terperinci
                            </p>

                            <textarea
                                id="details"
                                value={data.details}
                                onChange={(e) => setData('details', e.target.value)}
                                rows={6}
                                maxLength={2000}
                                required
                                placeholder="Contoh: Tukang tidak hadir pada tarikh yang dipersetujui dan tidak memberi maklum balas apabila dihubungi."
                                className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                            />

                            {errors.details && (
                                <p className="mt-2 text-xs font-semibold text-rose-600">
                                    {errors.details}
                                </p>
                            )}
                        </div>

                        {/* Info callout */}
                        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                            <div className="flex items-start gap-3">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                                    <Icon.Info style={{ width: 14, height: 14 }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-amber-900">
                                        Sebelum anda hantar
                                    </p>
                                    <ul className="mt-1.5 space-y-1 text-xs leading-5 text-amber-800/90">
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                                            Pastikan anda telah cuba menghubungi
                                            tukang terlebih dahulu.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                                            Sertakan butiran yang jelas supaya
                                            kami boleh menyiasat.
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-600" />
                                            Laporan palsu boleh menjejaskan
                                            akaun anda.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
                            <Link
                                href={route('providers.show', provider.id)}
                                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing || !canSubmit}
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                            >
                                <Icon.Flag style={{ width: 14, height: 14 }} />
                                Hantar laporan
                                <Icon.ArrowRight
                                    className="transition-transform group-hover:translate-x-0.5"
                                    style={{ width: 14, height: 14 }}
                                />
                            </button>
                        </div>
                    </div>
                </form>

                {/* ============ TRUST NOTE ============ */}
                <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                    <div className="flex items-start gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                            <Icon.Shield style={{ width: 16, height: 16 }} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-stone-900">
                                Laporan anda adalah sulit
                            </p>
                            <p className="mt-0.5 text-xs leading-5 text-stone-600">
                                Kami mengambil setiap laporan dengan serius.
                                Tukang tidak akan dimaklumkan siapa yang
                                melaporkan mereka.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ============ 🆕 CONFIRMATION MODAL ============ */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-report-title"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
                        onClick={() => !processing && setShowConfirm(false)}
                        aria-hidden="true"
                    />

                    {/* Dialog */}
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/20">
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                                <Icon.Alert style={{ width: 26, height: 26 }} />
                            </div>

                            <h2
                                id="confirm-report-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-stone-900"
                            >
                                Adakah anda ingin melaporkan?
                            </h2>

                            {/* Provider summary inside modal */}
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-emerald-100 text-sm font-bold text-emerald-800">
                                    {providerPhoto ? (
                                        <img
                                            src={providerPhoto}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getProviderInitial(provider)
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-stone-800">
                                        {providerName}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-stone-500">
                                        {data.reason
                                            ? getReasonLabel(data.reason)
                                            : 'Sebab belum dipilih'}
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-sm leading-6 text-stone-600">
                                Laporan ini akan dihantar kepada pasukan
                                sokongan kami untuk disemak. Sila pastikan
                                maklumat yang anda berikan adalah benar.
                            </p>

                            {/* Action buttons */}
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={processing}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-bold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
                                >
                                    Tidak, kembali
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmSubmit}
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"
                                >
                                    {processing ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Menghantar...
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Flag style={{ width: 14, height: 14 }} />
                                            Ya, hantar
                                        </>
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