import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/MainLayout';

/* ---------- Small icons ---------- */
const Icon = {
    Search: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="9" cy="9" r="5.5" />
            <path d="M14 14l3 3" />
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
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10.5l4 4 8-9" />
        </svg>
    ),
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Sparkle: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3l1.5 4.5L16 9l-4.5 1.5L10 15l-1.5-4.5L4 9l4.5-1.5L10 3z" />
        </svg>
    ),
};

/* ---------- Helpers ---------- */
const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ms-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const statusStyles = {
    pending:   'bg-amber-50 text-amber-700 border-amber-200',
    accepted:  'bg-sky-50 text-sky-700 border-sky-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const statusLabels = {
    pending:   'Menunggu',
    accepted:  'Diterima',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
};

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, icon: Ico, tone = 'emerald' }) {
    const tones = {
        emerald: 'bg-emerald-50 text-emerald-700',
        amber:   'bg-amber-50 text-amber-700',
        sky:     'bg-sky-50 text-sky-700',
    };

    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {label}
                    </p>
                    <p className="mt-2 font-serif text-3xl tracking-tight text-stone-900">
                        {value}
                    </p>
                    {hint && (
                        <p className="mt-1 text-xs text-stone-500">{hint}</p>
                    )}
                </div>
                {Ico && (
                    <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}
                    >
                        <Ico style={{ width: 18, height: 18 }} />
                    </span>
                )}
            </div>
        </div>
    );
}

/* ---------- Action row ---------- */
function ActionRow({ href, title, subtitle, icon: Ico, tone = 'emerald' }) {
    const tones = {
        emerald: 'bg-emerald-700 text-white',
        amber:   'bg-amber-100 text-amber-700',
        stone:   'bg-stone-100 text-stone-700',
    };

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
            <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tones[tone]}`}
            >
                <Ico style={{ width: 18, height: 18 }} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-stone-800">
                    {title}
                </span>
                <span className="block text-xs text-stone-500">{subtitle}</span>
            </span>
            <Icon.ArrowRight
                className="shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
                style={{ width: 16, height: 16 }}
            />
        </Link>
    );
}

/* ============================ PAGE ============================ */
export default function Dashboard({ auth, stats = {}, recentBookings = [] }) {
    const firstName = auth?.user?.name?.split(' ')[0] ?? 'Pelanggan';

    return (
        <CustomerLayout>
            <Head title="Papan pemuka — Tukang Perak" />

            <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                {/* ============ HEADER ============ */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
                            <span className="h-px w-6 bg-emerald-700" />
                            PAPAN PEMUKA
                        </p>
                        <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 sm:text-5xl">
                            Selamat kembali, {firstName}.
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
                            Cari tukang tempatan, urus tempahan, dan pastikan
                            setiap kerja di rumah anda selesai dengan baik.
                        </p>
                    </div>

                    <Link
                        href="/browse"
                        className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                    >
                        <Icon.Search style={{ width: 14, height: 14 }} />
                        Cari tukang
                        <Icon.ArrowRight
                            className="transition-transform group-hover:translate-x-0.5"
                            style={{ width: 14, height: 14 }}
                        />
                    </Link>
                </div>

                {/* ============ STAT CARDS ============ */}
                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Tempahan aktif"
                        value={stats.activeBookings ?? 0}
                        hint="Sedang berjalan"
                        icon={Icon.Clock}
                        tone="amber"
                    />
                    <StatCard
                        label="Selesai"
                        value={stats.completedBookings ?? 0}
                        hint="Kerja selesai"
                        icon={Icon.Check}
                        tone="emerald"
                    />
                    <StatCard
                        label="Jumlah tempahan"
                        value={stats.totalBookings ?? 0}
                        hint="Sepanjang masa"
                        icon={Icon.Calendar}
                        tone="sky"
                    />
                </section>

                {/* ============ QUICK ACTIONS ============ */}
                <section className="mt-10">
                    <div className="mb-4">
                        <h2 className="font-serif text-2xl tracking-tight text-stone-900">
                            Tindakan pantas
                        </h2>
                        <p className="mt-1 text-sm text-stone-600">
                            Perkara biasa yang anda boleh buat di sini.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ActionRow
                            href="/browse"
                            title="Cari perkhidmatan"
                            subtitle="Terokai penyedia berhampiran"
                            icon={Icon.Search}
                            tone="emerald"
                        />
                        <ActionRow
                            href="/customer/bookings"
                            title="Tempahan saya"
                            subtitle="Lihat dan urus semua tempahan"
                            icon={Icon.Calendar}
                            tone="amber"
                        />
                        <ActionRow
                            href="/profile"
                            title="Tetapan akaun"
                            subtitle="Kemas kini profil anda"
                            icon={Icon.User}
                            tone="stone"
                        />
                    </div>
                </section>

                {/* ============ RECENT ACTIVITY ============ */}
                <section className="mt-10">
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="font-serif text-2xl tracking-tight text-stone-900">
                                Aktiviti terkini
                            </h2>
                            <p className="mt-1 text-sm text-stone-600">
                                Tempahan terbaru anda
                            </p>
                        </div>
                        {recentBookings.length > 0 && (
                            <Link
                                href="/customer/bookings"
                                className="hidden text-sm font-bold text-emerald-700 transition hover:text-emerald-800 sm:inline-flex sm:items-center sm:gap-1"
                            >
                                Lihat semua
                                <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                            </Link>
                        )}
                    </div>

                    {recentBookings.length === 0 ? (
                        /* ---------- Empty state ---------- */
                        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <Icon.Sparkle style={{ width: 24, height: 24 }} />
                            </span>
                            <h3 className="mt-4 font-serif text-xl tracking-tight text-stone-900">
                                Belum ada tempahan
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-600">
                                Mula dengan mencari tukang untuk kerja di rumah
                                anda. Tempahan pertama anda akan muncul di sini.
                            </p>
                            <Link
                                href="/browse"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                            >
                                <Icon.Search style={{ width: 14, height: 14 }} />
                                Cari tukang sekarang
                                <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                            </Link>
                        </div>
                    ) : (
                        /* ---------- Bookings list ---------- */
                        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                            <ul className="divide-y divide-stone-200">
                                {recentBookings.map((booking) => {
                                    const status = booking.status ?? 'pending';
                                    const badge =
                                        statusStyles[status] ??
                                        statusStyles.pending;

                                    return (
                                        <li key={booking.id}>
                                            <Link
                                                href={`/customer/bookings/${booking.id}`}
                                                className="group flex items-center gap-4 px-5 py-4 transition hover:bg-stone-50"
                                            >
                                                <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
                                                    {booking.provider_avatar_url ? (
                                                        <img
                                                            src={booking.provider_avatar_url}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        booking.provider_name?.charAt(0) ??
                                                        'T'
                                                    )}
                                                </span>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-stone-900 group-hover:text-emerald-700">
                                                                {booking.service_name ??
                                                                    'Tempahan'}
                                                            </p>
                                                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                                                {booking.provider_name ??
                                                                    'Tukang'}
                                                                {booking.district &&
                                                                    ` · ${booking.district}`}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge}`}
                                                        >
                                                            {statusLabels[status] ??
                                                                status}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1.5 text-xs text-stone-500">
                                                        <Icon.Calendar
                                                            style={{
                                                                width: 11,
                                                                height: 11,
                                                                display: 'inline',
                                                                marginRight: 4,
                                                                verticalAlign: '-1px',
                                                            }}
                                                        />
                                                        {formatDate(
                                                            booking.scheduled_at ??
                                                                booking.created_at
                                                        )}
                                                    </p>
                                                </div>

                                                <Icon.ArrowRight
                                                    className="shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700"
                                                    style={{ width: 16, height: 16 }}
                                                />
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Mobile view all link */}
                            <div className="border-t border-stone-200 px-5 py-3 text-center sm:hidden">
                                <Link
                                    href="/customer/bookings"
                                    className="text-sm font-bold text-emerald-700 hover:text-emerald-800"
                                >
                                    Lihat semua tempahan →
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </CustomerLayout>
    );
}