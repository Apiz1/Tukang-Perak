import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

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

export default function Home({ categories = [], featuredProviders = [] }) {
    return (
        <MainLayout>
            <Head title="Tukang Perak — Servis tempatan yang dipercayai" />

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

                        <form
                            className="mt-8 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg shadow-stone-900/5 sm:flex"
                            action="/providers"
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
                                        <option key={category.id} value={category.slug ?? category.id}>
                                            {category.name}
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
                                    <option value="ipoh">Ipoh</option>
                                    <option value="taiping">Taiping</option>
                                    <option value="kuala-kangsar">Kuala Kangsar</option>
                                    <option value="manjung">Manjung</option>
                                    <option value="teluk-intan">Teluk Intan</option>
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

                    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-200/50 blur-3xl" />
                        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-800 p-7 text-white shadow-2xl shadow-emerald-950/20 sm:p-9">
                            <p className="text-sm font-medium text-emerald-100">Mudah. Tempatan. Dipercayai.</p>
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

            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold text-emerald-700">CARI MENGIKUT KATEGORI</p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                            Apa yang perlu dibaiki?
                        </h2>
                    </div>
                    <Link
                        href="/services"
                        className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:block"
                    >
                        Lihat semua →
                    </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {categories.slice(0, 6).map((category, index) => {
                        const style = categoryStyles[index % categoryStyles.length];

                        return (
                            <Link
                                key={category.id}
                                href={`/providers?category=${category.slug ?? category.id}`}
                                className="group rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-stone-900/5"
                            >
                                <span className={`grid h-11 w-11 place-items-center rounded-xl text-xl ${style.color}`}>
                                    {style.icon}
                                </span>
                                <p className="mt-5 text-sm font-semibold text-stone-800 group-hover:text-emerald-700">
                                    {category.name}
                                </p>
                                <p className="mt-1 text-xs text-stone-500">
                                    {category.providers_count ?? 'Lihat penyedia'}{' '}
                                    {category.providers_count ? 'penyedia' : ''}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="border-y border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-emerald-700">PILIHAN MINGGU INI</p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                                Tukang yang mendapat kepercayaan pelanggan
                            </h2>
                        </div>
                        <Link
                            href="/providers"
                            className="hidden text-sm font-semibold text-emerald-700 hover:text-emerald-800 sm:block"
                        >
                            Terokai semua →
                        </Link>
                    </div>

                    <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {featuredProviders.map((provider) => (
                            <Link
                                key={provider.id}
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
                                            provider.name?.charAt(0)
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-semibold text-stone-900 group-hover:text-emerald-700">
                                            {provider.name}
                                        </h3>
                                        <p className="mt-0.5 truncate text-sm text-stone-600">
                                            {provider.service_name ?? provider.category?.name ?? 'Penyedia perkhidmatan'}
                                        </p>
                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                            <span className="font-semibold text-amber-600">
                                                ★ {provider.rating ?? '5.0'}
                                            </span>
                                            <span className="text-stone-400">
                                                {provider.review_count ? `(${provider.review_count} ulasan)` : 'Disahkan'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-stone-200 px-5 py-3 text-xs text-stone-500">
                                    <span>{provider.district ?? 'Perak'}</span>
                                    <span className="font-semibold text-emerald-700">Lihat profil →</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {featuredProviders.length === 0 && (
                        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-500">
                            Penyedia perkhidmatan pilihan akan dipaparkan di sini.
                        </div>
                    )}
                </div>
            </section>

            <section id="cara-kerja" className="bg-stone-900 text-white">
                <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
                    <div className="max-w-xl">
                        <p className="text-sm font-semibold text-emerald-400">BAGAIMANA IA BERFUNGSI</p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Urusan rumah sepatutnya tidak rumit.
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-10 md:grid-cols-3">
                        {steps.map((step) => (
                            <div key={step.number} className="border-t border-white/20 pt-5">
                                <span className="text-sm font-semibold text-emerald-400">{step.number}</span>
                                <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                                <p className="mt-3 max-w-xs text-sm leading-6 text-stone-400">{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}