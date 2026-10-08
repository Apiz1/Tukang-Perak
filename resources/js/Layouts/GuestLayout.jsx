import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f7f7f2] lg:grid lg:grid-cols-2">
            {/* Brand panel */}
            <section className="relative hidden overflow-hidden bg-[#176b4d] p-12 text-white lg:flex lg:flex-col">
                <Link href="/" className="relative z-10 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#dcebc4] text-lg font-black text-[#10513a]">
                        T
                    </span>

                    <span className="text-xl font-semibold tracking-tight">
                        Tukang<span className="text-[#b8e0bd]">Perak</span>
                    </span>
                </Link>

                <div className="relative z-10 my-auto max-w-lg">
                    <p className="text-xs font-bold tracking-[0.18em] text-[#b8e0bd]">
                        SERVIS TEMPATAN DIPERCAYAI
                    </p>

                    <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight">
                        Rumah terurus,
                        <span className="block text-[#dcebc4]">
                            hidup lebih tenang.
                        </span>
                    </h1>

                    <p className="mt-7 max-w-md text-base leading-7 text-emerald-100">
                        Tukang Perak menghubungkan anda dengan penyedia servis
                        tempatan untuk setiap kerja yang penting.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-3 text-sm text-emerald-100">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-emerald-200/30">
                        ✓
                    </span>
                    Penyedia servis daripada komuniti Perak
                </div>

                {/* Decorative shapes */}
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full border-[48px] border-[#dcebc4]/10" />
                <div className="absolute right-20 top-24 h-24 w-24 rounded-full bg-[#dcebc4]/10" />
            </section>

            {/* Form panel */}
            <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
                <div className="w-full max-w-md">
                    <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#176b4d] text-lg font-black text-white">
                            T
                        </span>

                        <span className="text-lg font-semibold tracking-tight text-stone-900">
                            Tukang<span className="text-emerald-700">Perak</span>
                        </span>
                    </Link>

                    {children}

                    <p className="mt-10 text-center text-xs text-stone-400">
                        © {new Date().getFullYear()} Tukang Perak · Perak, Malaysia
                    </p>
                </div>
            </main>
        </div>
    );
}