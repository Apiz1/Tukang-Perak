import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

/* ---------- Static display data ---------- */
const categoryStyles = [
    { icon: '❄️', color: 'bg-sky-50 text-sky-700' },
    { icon: '🔧', color: 'bg-amber-50 text-amber-700' },
    { icon: '⚡', color: 'bg-violet-50 text-violet-700' },
    { icon: '🧹', color: 'bg-rose-50 text-rose-700' },
    { icon: '🎨', color: 'bg-orange-50 text-orange-700' },
    { icon: '🛠️', color: 'bg-emerald-50 text-emerald-700' },
];

const steps = [
    {
        number: '01',
        title: 'Cari perkhidmatan',
        text: 'Pilih kerja yang anda perlukan dan kawasan anda.',
    },
    {
        number: '02',
        title: 'Bandingkan tukang',
        text: 'Lihat profil, ulasan dan pengalaman sebelum memilih.',
    },
    {
        number: '03',
        title: 'Hubungi dengan yakin',
        text: 'Teruskan perbualan dan tetapkan masa yang sesuai.',
    },
];

const districts = [
    { value: 'ipoh',          label: 'Ipoh' },
    { value: 'taiping',       label: 'Taiping' },
    { value: 'kuala_kangsar', label: 'Kuala Kangsar' },
    { value: 'manjung',       label: 'Manjung' },
    { value: 'teluk_intan',   label: 'Teluk Intan' },
    { value: 'parit_buntar',  label: 'Parit Buntar' },
];

/* ---------- Helpers (tolerate both data shapes) ---------- */
const getCategoryValue = (c) => c.slug ?? c.value ?? c.id;
const getCategoryLabel = (c) => c.name ?? c.label ?? '';
const getCategoryCount = (c) => c.providers_count ?? null;

const getProviderName = (p) =>
    p.business_name ?? p.name ?? p.user?.name ?? 'Penyedia perkhidmatan';

const getProviderInitial = (p) => getProviderName(p).charAt(0).toUpperCase();

const getProviderCategory = (p) =>
    p.category?.name ?? p.category_name ?? p.category ?? p.service_name ?? 'Penyedia perkhidmatan';

const getProviderDistrict = (p) =>
    p.district_label ??
    p.district ??
    p.user?.district ??
    'Perak';

const getProviderRating = (p) => p.rating ?? p.average_rating ?? null;
const getProviderReviews = (p) => p.review_count ?? p.reviews_count ?? null;

const getProviderServicesCount = (p) => {
    if (Array.isArray(p.services)) return p.services.length;
    if (typeof p.services_count === 'number') return p.services_count;
    return null;
};

/* ============================ PAGE ============================ */
export default function Home({ categories = [], featuredProviders = [] }) {
    return (
        <MainLayout>
            <Head title="Tukang Perak — Servis tempatan yang dipercayai" />

            {/* ============ HERO ============ */}
            <section className="overflow-hidden bg-stone-50">
                <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-24">
                    <div className="max-w-2xl">
                        <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                            <span className="h-px w-8 bg-emerald-700" />
                            SERVIS TEMPATAN, PERAK
                        </p>

                        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                            Cari tukang yang
                            <span className="block text-emerald-700">betul untuk kerja anda.</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                            Dari paip bocor hingga aircond tidak sejuk, temui penyedia
                            perkhidmatan tempatan yang sedia membantu.
                        </p>

                        {/* Search form — 🆕 action="/browse" */}
                        <form
                            className="mt-8 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-900/5 sm:flex"
                            action="/browse"
                            method="GET"
                        >
                            <div className="flex flex-1 items-center gap-3 border-b border-stone-100 px-3 py-3 sm:border-b-0 sm:border-r">
                                <span className="text-lg">⌕</span>
                                <select
                                    name="category"
                                    className="w-full bg-transparent text-sm font-medium text-stone-700 outline-none"
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Servis apa yang anda cari?
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={getCategoryValue(category)}
                                            value={getCategoryValue(category)}
                                        >
                                            {getCategoryLabel(category)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-1 items-center gap-3 px-3 py-3">
                                <span className="text-base">⌖</span>
                                <select
                                    name="district"
                                    className="w-full bg-transparent text-sm font-medium text-stone-700 outline-none"
                                    defaultValue=""
                                >
                                    <option value="">Semua kawasan di Perak</option>
                                    {districts.map((d) => (
                                        <option key={d.value} value={d.value}>
                                            {d.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="mt-1 w-full rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:mt-0 sm:w-auto"
                            >
                                Cari tukang
                            </button>
                        </form>

                        <p className="mt-4 text-xs text-stone-500">
                            Popular: Aircond · Plumbing · Elektrik · Pembersihan
                        </p>
                    </div>

                    {/* Right side card */}
                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-200/50 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-800 p-7 text-white shadow-2xl shadow-emerald-950/20 sm:p-9">
                            <p className="text-sm font-medium text-emerald-100">
                                Mudah. Tempatan. Dipercayai.
                            </p>
                            <div className="mt-12 border-t border-white/20 pt-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-4xl font-semibold tracking-tight">Perak</p>
                                        <p className="mt-1 text-sm text-emerald-100">
                                            Servis dekat dengan anda
                                        </p>
                                    </div>
                                    <span className="text-5xl">⌂</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ CATEGORIES ============ */}
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold text-emerald-700">
                            CARI MENGIKUT KATEGORI
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                            Apa yang perlu dibaiki?
                        </h2>
                    </div>
                    {/* 🆕 href="/browse" instead of /services */}
                    <Link
                        href="/browse"
                        className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:block"
                    >
                        Lihat semua →
                    </Link>
                </div>

                {categories.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500">
                        Kategori akan dipaparkan di sini.
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {categories.slice(0, 6).map((category, index) => {
                            const style = categoryStyles[index % categoryStyles.length];
                            const count = getCategoryCount(category);

                            return (
                                <Link
                                    key={getCategoryValue(category)}
                                    // 🆕 /browse instead of /providers
                                    href={`/browse?category=${getCategoryValue(category)}`}
                                    className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-900/5"
                                >
                                    <span
                                        className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${style.color}`}
                                    >
                                        {style.icon}
                                    </span>
                                    <p className="mt-5 text-sm font-semibold text-stone-800 group-hover:text-emerald-700">
                                        {getCategoryLabel(category)}
                                    </p>
                                    <p className="mt-1 text-xs text-stone-500">
                                        {count != null
                                            ? `${count} penyedia`
                                            : 'Lihat penyedia'}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ============ FEATURED PROVIDERS ============ */}
            <section className="border-y border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">
                                PILIHAN MINGGU INI
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                                Tukang yang mendapat kepercayaan pelanggan
                            </h2>
                        </div>
                        {/* 🆕 href="/browse" */}
                        <Link
                            href="/browse"
                            className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:block"
                        >
                            Terokai semua →
                        </Link>
                    </div>

                    {featuredProviders.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500">
                            Penyedia perkhidmatan pilihan akan dipaparkan di sini.
                        </div>
                    ) : (
                        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {featuredProviders.map((provider) => {
                                const rating = getProviderRating(provider);
                                const reviews = getProviderReviews(provider);
                                const servicesCount = getProviderServicesCount(provider);

                                return (
                                    <Link
                                        key={provider.id}
                                        // ✅ This already matches /providers/{providerProfile}
                                        href={`/providers/${provider.slug ?? provider.id}`}
                                        className="group overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 transition hover:border-emerald-200 hover:shadow-xl hover:shadow-stone-900/5"
                                    >
                                        <div className="flex items-center gap-4 p-5">
                                            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-lg font-semibold text-emerald-800">
                                                {provider.avatar_url ? (
                                                    <img
                                                        src={provider.avatar_url}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    getProviderInitial(provider)
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold text-stone-900 group-hover:text-emerald-700">
                                                    {getProviderName(provider)}
                                                </h3>
                                                <p className="mt-0.5 truncate text-sm text-stone-600">
                                                    {getProviderCategory(provider)}
                                                </p>
                                                <div className="mt-2 flex items-center gap-2 text-xs">
                                                    <span className="font-semibold text-amber-600">
                                                        ★ {rating ?? '5.0'}
                                                    </span>
                                                    <span className="text-stone-400">
                                                        {reviews
                                                            ? `(${reviews} ulasan)`
                                                            : 'Disahkan'}
                                                    </span>
                                                    {servicesCount != null && (
                                                        <span className="text-stone-400">
                                                            · {servicesCount} perkhidmatan
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3 text-xs text-stone-500">
                                            <span>{getProviderDistrict(provider)}</span>
                                            <span className="font-semibold text-emerald-700">
                                                Lihat profil →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ============ HOW IT WORKS ============ */}
            <section id="cara-kerja" className="bg-stone-900 text-white">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                    <div className="max-w-xl">
                        <p className="text-sm font-semibold text-emerald-400">
                            BAGAIMANA IA BERFUNGSI
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Urusan rumah sepatutnya tidak rumit.
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        {steps.map((step) => (
                            <div key={step.number} className="border-t border-white/20 pt-5">
                                <span className="text-sm font-semibold text-emerald-400">
                                    {step.number}
                                </span>
                                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                                <p className="mt-3 max-w-xs text-sm leading-6 text-stone-400">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}