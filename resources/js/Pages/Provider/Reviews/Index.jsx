import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small icons ---------- */
const Icon = {
    Star: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    StarOutline: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    Chat: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 5.5A2.5 2.5 0 015.5 3h9A2.5 2.5 0 0117 5.5v6a2.5 2.5 0 01-2.5 2.5H8l-5 3.5V5.5z" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Calendar: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
};

/* ---------- Helpers ---------- */
const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getCustomerName = (review) =>
    review?.customer?.name ?? review?.user?.name ?? 'Pelanggan';

const getCustomerInitial = (review) =>
    getCustomerName(review).charAt(0).toUpperCase();

const getServiceTitle = (review) =>
    review?.booking?.service?.title ?? 'Perkhidmatan';

/* ---------- Stat chip ---------- */
function StatCard({ label, value, accent = 'emerald' }) {
    const accentMap = {
        emerald: 'bg-emerald-50 text-emerald-700',
        amber: 'bg-amber-50 text-amber-600',
        stone: 'bg-stone-100 text-stone-600',
    };

    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                {label}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-serif text-2xl tracking-tight text-stone-900">
                {accent === 'amber' && (
                    <Icon.Star
                        style={{ width: 18, height: 18 }}
                        className="text-amber-500"
                    />
                )}
                <span className={accentMap[accent] ? '' : ''}>{value}</span>
            </p>
        </div>
    );
}

/* ---------- Stars display ---------- */
function Stars({ rating }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <span
                    key={n}
                    className={n <= rating ? 'text-amber-500' : 'text-stone-300'}
                >
                    {n <= rating ? (
                        <Icon.Star style={{ width: 13, height: 13 }} />
                    ) : (
                        <Icon.StarOutline style={{ width: 13, height: 13 }} />
                    )}
                </span>
            ))}
            <span className="ml-1.5 text-xs font-semibold text-stone-600">
                {rating}/5
            </span>
        </div>
    );
}

/* ---------- Single review card ---------- */
function ReviewCard({ review }) {
    const [replying, setReplying] = useState(false);

    const {
        data,
        setData,
        patch,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        provider_reply: review.provider_reply ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('provider.reviews.reply', review.id), {
            preserveScroll: true,
            onSuccess: () => setReplying(false),
        });
    };

    const cancelReply = () => {
        reset();
        setReplying(false);
    };

    const hasReply = Boolean(review.provider_reply);

    return (
        <div className="rounded-2xl border border-stone-200 bg-white">
            {/* Header: customer + rating */}
            <div className="flex items-start gap-4 p-5 sm:p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                    {review?.customer?.photo_path ? (
                        <img
                            src={`/storage/${review.customer.photo_path}`}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        getCustomerInitial(review)
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-stone-900">
                                {getCustomerName(review)}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
                                <Icon.Calendar
                                    style={{ width: 11, height: 11 }}
                                />
                                {formatDate(review.created_at)}
                            </p>
                        </div>

                        <Stars rating={review.rating} />
                    </div>

                    {/* Service chip */}
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-semibold text-stone-600">
                        <Icon.Wrench style={{ width: 11, height: 11 }} />
                        {getServiceTitle(review)}
                    </div>

                    {/* Comment */}
                    {review.comment ? (
                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-700">
                            {review.comment}
                        </p>
                    ) : (
                        <p className="mt-3 text-sm italic text-stone-400">
                            Pelanggan tidak meninggalkan komen.
                        </p>
                    )}
                </div>
            </div>

            {/* Reply area */}
            <div className="border-t border-stone-200 bg-stone-50/60 p-5 sm:p-6">
                {hasReply && !replying ? (
                    /* Existing reply */
                    <div className="flex items-start gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-700 text-white">
                            <Icon.Chat style={{ width: 14, height: 14 }} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                    Balasan anda
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setReplying(true)}
                                    className="text-xs font-bold text-emerald-700 underline-offset-4 hover:underline"
                                >
                                    Kemas kini
                                </button>
                            </div>
                            <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-stone-700">
                                {review.provider_reply}
                            </p>
                        </div>
                    </div>
                ) : replying || !hasReply ? (
                    /* Reply form */
                    <form onSubmit={submit}>
                        {!replying && !hasReply ? (
                            <button
                                type="button"
                                onClick={() => setReplying(true)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:border-emerald-200 hover:text-emerald-700"
                            >
                                <Icon.Chat style={{ width: 12, height: 12 }} />
                                Balas ulasan
                            </button>
                        ) : (
                            <>
                                <label
                                    htmlFor={`reply-${review.id}`}
                                    className="block text-xs font-bold uppercase tracking-wider text-stone-500"
                                >
                                    Balasan anda
                                </label>
                                <textarea
                                    id={`reply-${review.id}`}
                                    value={data.provider_reply}
                                    onChange={(e) =>
                                        setData('provider_reply', e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Contoh: Terima kasih atas maklum balas anda. Kami akan perbaiki perkhidmatan."
                                    className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm leading-6 text-stone-800 placeholder-stone-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                                />

                                {errors.provider_reply && (
                                    <p className="mt-2 text-xs font-semibold text-rose-600">
                                        {errors.provider_reply}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {processing ? (
                                            <>
                                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                                Menghantar...
                                            </>
                                        ) : (
                                            <>
                                                {hasReply
                                                    ? 'Kemas kini balasan'
                                                    : 'Hantar balasan'}
                                                <Icon.ArrowRight
                                                    style={{ width: 11, height: 11 }}
                                                />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={cancelReply}
                                        disabled={processing}
                                        className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-600 transition hover:bg-stone-100 disabled:opacity-60"
                                    >
                                        Batal
                                    </button>

                                    {recentlySuccessful && (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                            <Icon.Check
                                                style={{ width: 12, height: 12 }}
                                            />
                                            Disimpan
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </form>
                ) : null}
            </div>
        </div>
    );
}

/* ============================ PAGE ============================ */
export default function Index({ reviews = [], stats = {} }) {
    const total = reviews.length;

    /* Compute summary stats from the reviews array if not provided */
    const avgRating =
        stats.average_rating ??
        (total > 0
            ? (
                  reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / total
              ).toFixed(1)
            : null);

    const repliedCount =
        stats.replied_count ??
        reviews.filter((r) => Boolean(r.provider_reply)).length;

    return (
        <ProviderLayout title="Ulasan" breadcrumb="Papan pemuka / Ulasan">
            <Head title="Ulasan — Tukang Perak" />

            <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
                {/* ---------- Header ---------- */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                            <span className="h-px w-5 bg-emerald-700" />
                            ULASAN PELANGGAN
                        </p>
                        <h1 className="mt-2 font-serif text-3xl tracking-tight text-stone-900">
                            Apa kata pelanggan anda
                        </h1>
                        <p className="mt-1 text-sm text-stone-600">
                            Balas ulasan untuk membina kepercayaan dan
                            meningkatkan reputasi anda.
                        </p>
                    </div>
                </div>

                {/* ---------- Stats ---------- */}
                {total > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <StatCard label="Jumlah ulasan" value={total} />
                        <StatCard
                            label="Purata penilaian"
                            value={avgRating ?? '—'}
                            accent="amber"
                        />
                        <StatCard
                            label="Telah dibalas"
                            value={`${repliedCount}/${total}`}
                        />
                    </div>
                )}

                {/* ---------- Empty state ---------- */}
                {total === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600">
                            <Icon.StarOutline
                                style={{ width: 24, height: 24 }}
                            />
                        </span>
                        <h3 className="mt-4 font-serif text-xl tracking-tight text-stone-900">
                            Belum ada ulasan
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                            Ulasan pelanggan akan dipaparkan di sini selepas
                            mereka menyelesaikan tempahan dengan anda.
                        </p>
                    </div>
                ) : (
                    /* ---------- Review list ---------- */
                    <div className="mt-6 flex flex-col gap-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
        </ProviderLayout>
    );
}