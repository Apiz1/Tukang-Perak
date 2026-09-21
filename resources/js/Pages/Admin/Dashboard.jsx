import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

/* ---------- Small inline icons ---------- */
const Icon = {
    Users: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="7" cy="8" r="3" />
            <path d="M2 17c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
            <path d="M13 6.5a3 3 0 110 6" />
            <path d="M14 17c0-1.9-.6-3.2-1.6-4.1 2.6-.3 5 1.3 5 4.1" />
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
    Clock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 5.5V10l3 1.8" />
        </svg>
    ),
    Check: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
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
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Bell: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 8a5 5 0 0110 0v3l1.5 2.5h-13L5 11V8z" />
            <path d="M8.5 15.5a1.5 1.5 0 003 0" />
        </svg>
    ),
};

/* ---------- Stat card ---------- */
function StatCard({ label, value, hint, icon: Ico, accent = 'green' }) {
    const accentMap = {
        green: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber: 'bg-amber-50 text-amber-700',
        sky:   'bg-sky-50 text-sky-700',
        rose:  'bg-rose-50 text-rose-700',
        ink:   'bg-[color:var(--warm)] text-[color:var(--ink)]',
    };
    return (
        <div className="admin-stat">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="admin-stat__label">{label}</p>
                    <p className="admin-stat__value">{value}</p>
                    {hint && (
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                            {hint}
                        </p>
                    )}
                </div>
                {Ico && (
                    <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accentMap[accent]}`}
                    >
                        <Ico style={{ width: 18, height: 18 }} />
                    </span>
                )}
            </div>
        </div>
    );
}

/* ---------- Quick action row ---------- */
function ActionRow({ href, title, subtitle, icon: Ico, accent = 'green' }) {
    const accentMap = {
        green: 'bg-[color:var(--green)] text-white',
        amber: 'bg-amber-500 text-white',
        ink:   'bg-[color:var(--ink)] text-white',
        lime:  'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
    };
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#a9cdb4] hover:shadow-sm"
        >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${accentMap[accent]}`}>
                <Ico style={{ width: 18, height: 18 }} />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[color:var(--ink)]">
                    {title}
                </span>
                <span className="block text-xs text-[color:var(--muted)]">
                    {subtitle}
                </span>
            </span>
            <Icon.ArrowRight
                className="text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                style={{ width: 16, height: 16 }}
            />
        </Link>
    );
}

/* ============================ PAGE ============================ */
export default function Dashboard({ stats, recentActivity = [] }) {
    const pendingProviders = stats?.pendingProviders ?? 0;

    return (
        <AdminLayout title="Papan pemuka" breadcrumb="Pentadbiran">
            <Head title="Papan pemuka — Admin Tukang Perak" />

            {/* ---------- Pending alert banner ---------- */}
            {pendingProviders > 0 && (
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                        <Icon.Clock style={{ width: 18, height: 18 }} />
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-amber-900">
                            {pendingProviders} tukang menunggu kelulusan
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-800/90">
                            Semak dan luluskan permohonan mereka supaya mereka
                            boleh mula menerima tempahan.
                        </p>
                    </div>

                    <Link
                        href="/admin/providers"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700"
                    >
                        Semak sekarang
                        <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                    </Link>
                </div>
            )}

            {/* ---------- Page heading ---------- */}
            <div className="admin-page-header">
                <p className="eyebrow">RINGKASAN PENTADBIRAN</p>
                <h1 className="admin-page-heading mt-3">
                    Gambaran keseluruhan platform.
                </h1>
                <p className="admin-page-subtitle">
                    Pantau prestasi, urus tukang dan pelanggan, serta semak
                    tempahan di satu tempat.
                </p>
            </div>

            {/* ---------- Stat cards ---------- */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Tukang menunggu"
                    value={pendingProviders}
                    hint={
                        pendingProviders > 0
                            ? 'Perlu tindakan segera'
                            : 'Semua telah disemak'
                    }
                    icon={Icon.Clock}
                    accent="amber"
                />
                <StatCard
                    label="Jumlah pelanggan"
                    value={stats?.totalCustomers ?? 0}
                    hint="Berdaftar di platform"
                    icon={Icon.Users}
                    accent="ink"
                />
                <StatCard
                    label="Tukang diluluskan"
                    value={stats?.totalProviders ?? 0}
                    hint="Aktif menerima tempahan"
                    icon={Icon.Wrench}
                    accent="green"
                />
                <StatCard
                    label="Jumlah tempahan"
                    value={stats?.totalBookings ?? 0}
                    hint="Sejak pelancaran"
                    icon={Icon.Calendar}
                    accent="sky"
                />
            </section>

            {/* ---------- Quick actions + Recent activity ---------- */}
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                {/* Recent activity / bookings */}
                <div className="admin-card">
                    <div className="admin-card__header">
                        <div>
                            <h2 className="admin-card__title">Aktiviti terkini</h2>
                            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                Tempahan dan pendaftaran terbaru
                            </p>
                        </div>
                        <Link
                            href="/admin/bookings"
                            className="hidden text-sm font-bold text-[color:var(--green)] transition hover:text-[color:var(--green-dark)] sm:inline-flex sm:items-center sm:gap-1"
                        >
                            Lihat semua
                            <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                        </Link>
                    </div>

                    <div className="admin-card__body !py-2">
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                    <Icon.Bell style={{ width: 20, height: 20 }} />
                                </span>
                                <p className="text-sm font-semibold text-[color:var(--ink)]">
                                    Tiada aktiviti terkini
                                </p>
                                <p className="max-w-xs text-xs text-[color:var(--muted)]">
                                    Aktiviti terbaru dari tukang dan pelanggan
                                    akan dipaparkan di sini.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-[color:var(--line)]">
                                {recentActivity.map((item, index) => (
                                    <li
                                        key={item.id ?? index}
                                        className="flex items-start gap-3 py-3"
                                    >
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--warm)] text-sm">
                                            {item.icon ?? '•'}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-[color:var(--ink)]">
                                                {item.title}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                                                {item.description}
                                            </p>
                                        </div>
                                        <span className="shrink-0 text-xs text-[color:var(--muted)]">
                                            {item.time}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-col gap-6">
                    <div className="admin-card">
                        <div className="admin-card__header">
                            <h2 className="admin-card__title">Tindakan pantas</h2>
                        </div>

                        <div className="admin-card__body space-y-2">
                            <ActionRow
                                href="/admin/providers"
                                title="Semak permohonan tukang"
                                subtitle="Lulus atau tolak pendaftaran baru"
                                icon={Icon.Wrench}
                                accent="green"
                            />
                            <ActionRow
                                href="/admin/customers"
                                title="Urus pelanggan"
                                subtitle="Lihat dan urus akaun pelanggan"
                                icon={Icon.Users}
                                accent="ink"
                            />
                            <ActionRow
                                href="/admin/bookings"
                                title="Semak tempahan"
                                subtitle="Pantau semua tempahan aktif"
                                icon={Icon.Calendar}
                                accent="lime"
                            />
                        </div>
                    </div>

                    {/* System health card */}
                    <div className="admin-card overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--ink)] to-[#0d1712]" />
                            <div className="relative p-5 text-white">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                                    Status sistem
                                </p>

                                <div className="mt-2 flex items-end justify-between">
                                    <p
                                        className="font-serif text-3xl"
                                        style={{ letterSpacing: '-0.03em' }}
                                    >
                                        Sihat
                                    </p>
                                    <span className="text-3xl opacity-80">⌂</span>
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    <p className="text-xs text-emerald-100/90">
                                        Semua perkhidmatan berjalan normal
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                        <Icon.Shield
                                            style={{
                                                width: 10,
                                                height: 10,
                                                display: 'inline',
                                                marginRight: 4,
                                                verticalAlign: '-1px',
                                            }}
                                        />
                                        Selamat
                                    </span>
                                    <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                        <Icon.Check
                                            style={{
                                                width: 10,
                                                height: 10,
                                                display: 'inline',
                                                marginRight: 4,
                                                verticalAlign: '-1px',
                                            }}
                                        />
                                        Disahkan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}