import { Head, Link } from '@inertiajs/react';
import ProviderLayout from '@/Layouts/ProviderLayout';

/* ---------- Small inline icons ---------- */
const Icon = {
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
    Star: (p) => (
        <svg viewBox="0 0 20 20" fill="currentColor" {...p}>
            <path d="M10 1.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L10 15l-5.25 2.75 1-5.85L1.5 7.75l5.9-.85L10 1.6z" />
        </svg>
    ),
    Calendar: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
            <path d="M3 8.5h14M7 2.5v4M13 2.5v4" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    Plus: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 4v12M4 10h12" />
        </svg>
    ),
    ArrowRight: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
    ),
    Alert: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 3.5l7.5 13h-15L10 3.5z" />
            <path d="M10 8.5v3.5M10 14.2h.01" />
        </svg>
    ),
    Shield: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2l6 2.5v5c0 3.6-2.6 6.5-6 8-3.4-1.5-6-4.4-6-8v-5L10 2z" />
        </svg>
    ),
    Ban: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="10" r="7.5" />
            <path d="M5 5l10 10" />
        </svg>
    ),
};

/* ---------- Helpers ---------- */
const formatCurrency = (value) =>
    value == null
        ? '—'
        : new Intl.NumberFormat('ms-MY', {
              style: 'currency',
              currency: 'MYR',
              maximumFractionDigits: 0,
          }).format(value);

const formatDate = (date) => {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('ms-MY', {
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
function StatCard({ label, value, hint, icon: Ico, accent = 'green' }) {
    const accentMap = {
        green: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber: 'bg-amber-50 text-amber-700',
        sky:   'bg-sky-50 text-sky-700',
        rose:  'bg-rose-50 text-rose-700',
    };
    return (
        <div className="provider-stat">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="provider-stat__label">{label}</p>
                    <p className="provider-stat__value">{value}</p>
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

/* ---------- Booking row ---------- */
function BookingRow({ booking }) {
    const status = booking.status ?? 'pending';
    const badge = statusStyles[status] ?? statusStyles.pending;

    return (
        <Link
            href={`/provider/bookings/${booking.id}`}
            className="group flex items-start gap-4 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[color:var(--line)] hover:bg-[color:var(--paper)]"
        >
            <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[color:var(--lime)] text-sm font-bold text-[color:var(--green-dark)]">
                {booking.customer?.avatar_url ? (
                    <img
                        src={booking.customer.avatar_url}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    booking.customer?.name?.charAt(0) ?? 'C'
                )}
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[color:var(--ink)] group-hover:text-[color:var(--green-dark)]">
                            {booking.service_name ?? 'Permintaan servis'}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[color:var(--muted)]">
                            {booking.customer?.name ?? 'Pelanggan'}
                            {booking.district && ` · ${booking.district}`}
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge}`}
                    >
                        {statusLabels[status] ?? status}
                    </span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                    <span className="inline-flex items-center gap-1">
                        <Icon.Calendar style={{ width: 12, height: 12 }} />
                        {formatDate(booking.scheduled_at ?? booking.created_at)}
                    </span>
                    {booking.budget != null && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[color:var(--green-dark)]">
                            {formatCurrency(booking.budget)}
                        </span>
                    )}
                </div>
            </div>

            <Icon.ArrowRight
                className="mt-3 shrink-0 text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                style={{ width: 16, height: 16 }}
            />
        </Link>
    );
}

/* ============================ PAGE ============================ */
export default function Dashboard({ providerProfile, stats, recentBookings = [] }) {
    const isPending   = providerProfile?.status === 'pending';
    const isRejected  = providerProfile?.status === 'rejected';
    const isApproved  = providerProfile?.status === 'approved';
    const isSuspended = providerProfile?.status === 'suspended';

    const firstName = providerProfile?.user?.name?.split(' ')[0] ?? 'Tukang';

    /* ---------- Profile completeness ---------- */
    const profileChecks = [
        {
            key: 'business_name',
            label: 'Nama perniagaan',
            done: Boolean(providerProfile?.business_name?.trim()),
        },
        {
            key: 'description',
            label: 'Penerangan perniagaan',
            done:
                Boolean(providerProfile?.description?.trim()) &&
                providerProfile.description.trim().length >= 30,
        },
        {
            key: 'photo',
            label: 'Gambar perniagaan',
            done: Boolean(providerProfile?.photo_path),
        },
        {
            key: 'category',
            label: 'Kategori perkhidmatan',
            done: Boolean(providerProfile?.category),
        },
        {
            key: 'district',
            label: 'Daerah operasi',
            done: Boolean(providerProfile?.district),
        },
    ];

    const completedCount = profileChecks.filter((c) => c.done).length;
    const completeness = Math.round(
        (completedCount / profileChecks.length) * 100
    );
    const missingFields = profileChecks.filter((c) => !c.done);

    /* ---------- Show app sections only when the provider is active ---------- */
    // Pending/Rejected: hide stats + bookings (they can't act on them yet)
    // Suspended: hide stats + bookings + quick actions (account frozen)
    const showStats = isApproved;
    const showBookings = isApproved || isPending; // pending providers may want a preview
    const showQuickActions = !isSuspended; // suspended users can still edit profile

    return (
        <ProviderLayout title="Papan pemuka" breadcrumb="Utama">
            <Head title="Papan pemuka — Tukang Perak" />

            {/* ============ VERIFICATION / STATUS BANNERS ============ */}

            {/* ---------- Suspended banner (highest priority) ---------- */}
            {isSuspended && (
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-300 bg-stone-100 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                    <div className="flex items-start gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-200 text-stone-700">
                            <Icon.Ban style={{ width: 18, height: 18 }} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-stone-900">
                                Akaun anda telah digantung
                            </p>
                            <p className="mt-1 text-sm leading-6 text-stone-700">
                                Anda tidak boleh menerima tempahan baharu
                                sementara akaun anda digantung.
                            </p>

                            {providerProfile?.suspension_reason && (
                                <div className="mt-3 rounded-lg border border-stone-300 bg-white/70 p-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-stone-600">
                                        Sebab penggantungan
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-stone-800">
                                        {providerProfile.suspension_reason}
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-xs leading-5 text-stone-600">
                                Jika anda rasa ini satu kesilapan, hubungi pasukan
                                sokongan kami di{' '}
                                <a
                                    href="mailto:hello@tukangperak.my"
                                    className="font-semibold text-stone-900 underline-offset-4 hover:underline"
                                >
                                    hello@tukangperak.my
                                </a>
                                .
                            </p>
                        </div>
                    </div>

                    <a
                        href="mailto:hello@tukangperak.my"
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl bg-stone-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-stone-900 sm:self-auto"
                    >
                        Hubungi sokongan
                        <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                    </a>
                </div>
            )}

            {/* ---------- Pending banner ---------- */}
            {isPending && !isSuspended && (
                <div className="mb-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                        <Icon.Clock style={{ width: 18, height: 18 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-amber-900">
                            Aplikasi anda sedang disemak
                        </p>
                        <p className="mt-1 text-sm leading-6 text-amber-800/90">
                            Pasukan kami akan mengesahkan profil anda dalam masa
                            1–2 hari bekerja. Anda boleh melengkapkan
                            perkhidmatan sementara menunggu.
                        </p>
                    </div>
                </div>
            )}

            {/* ---------- Rejected banner ---------- */}
            {isRejected && !isSuspended && (
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-start gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700">
                            <Icon.Alert style={{ width: 18, height: 18 }} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-rose-900">
                                Aplikasi anda tidak diluluskan
                            </p>
                            <p className="mt-1 text-sm leading-6 text-rose-800/90">
                                {providerProfile?.rejection_reason
                                    ? providerProfile.rejection_reason
                                    : 'Sila kemas kini maklumat anda dan hantar semula untuk semakan.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
                        <Link
                            href="/provider/reapply"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
                        >
                            Mohon semula
                            <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                        </Link>

                        <a
                            href="mailto:hello@tukangperak.my"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                        >
                            Hubungi sokongan
                        </a>
                    </div>
                </div>
            )}

            {/* ---------- Approved banner ---------- */}
            {isApproved && (
                <div className="mb-6 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Icon.Shield style={{ width: 18, height: 18 }} />
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-emerald-900">
                            Profil anda telah disahkan
                        </p>
                        <p className="mt-1 text-sm leading-6 text-emerald-800/90">
                            Selamat datang, {firstName}. Anda kini boleh menerima
                            tempahan daripada pelanggan di seluruh Perak.
                        </p>
                    </div>
                </div>
            )}

            {/* ---------- Page heading ---------- */}
            <div className="provider-page-header">
                <p className="eyebrow">RINGKASAN</p>
                <h1 className="provider-page-heading mt-3">
                    {isSuspended ? `Hai, ${firstName}.` : `Selamat kembali, ${firstName}.`}
                </h1>
                <p className="provider-page-subtitle">
                    {isSuspended
                        ? 'Akaun anda sedang digantung. Semak maklumat di bawah untuk butiran.'
                        : 'Berikut adalah prestasi dan aktiviti terkini anda.'}
                </p>
            </div>

            {/* ---------- Stat cards (approved only) ---------- */}
            {showStats && (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Jumlah tempahan"
                        value={stats?.totalBookings ?? 0}
                        hint="Sepanjang masa"
                        icon={Icon.Calendar}
                        accent="green"
                    />
                    <StatCard
                        label="Sebut harga menunggu"
                        value={stats?.pendingQuotes ?? 0}
                        hint="Perlu tindakan"
                        icon={Icon.Clock}
                        accent="amber"
                    />
                    <StatCard
                        label="Kerja selesai"
                        value={stats?.completedJobs ?? 0}
                        hint="Disahkan pelanggan"
                        icon={Icon.Check}
                        accent="sky"
                    />
                    <StatCard
                        label="Penilaian purata"
                        value={
                            stats?.averageRating != null
                                ? `★ ${Number(stats.averageRating).toFixed(1)}`
                                : '—'
                        }
                        hint={
                            stats?.reviewCount
                                ? `Daripada ${stats.reviewCount} ulasan`
                                : 'Belum ada ulasan'
                        }
                        icon={Icon.Star}
                        accent="green"
                    />
                </section>
            )}

            {/* ---------- Recent bookings + Quick actions ---------- */}
            {(showBookings || showQuickActions) && (
                <section className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    {/* Recent bookings */}
                    {showBookings && (
                        <div className="provider-card">
                            <div className="provider-card__header">
                                <div>
                                    <h2 className="provider-card__title">
                                        Tempahan terkini
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                                        {isApproved
                                            ? 'Permintaan terbaru daripada pelanggan'
                                            : 'Contoh paparan selepas anda diluluskan'}
                                    </p>
                                </div>

                                {isApproved && (
                                    <Link
                                        href="/provider/bookings"
                                        className="hidden text-sm font-bold text-[color:var(--green)] transition hover:text-[color:var(--green-dark)] sm:inline-flex sm:items-center sm:gap-1"
                                    >
                                        Lihat semua
                                        <Icon.ArrowRight style={{ width: 14, height: 14 }} />
                                    </Link>
                                )}
                            </div>

                            <div className="provider-card__body !py-2">
                                {recentBookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                                        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                            <Icon.Calendar style={{ width: 20, height: 20 }} />
                                        </span>
                                        <p className="text-sm font-semibold text-[color:var(--ink)]">
                                            {isApproved ? 'Belum ada tempahan' : 'Belum dibuka'}
                                        </p>
                                        <p className="max-w-xs text-xs text-[color:var(--muted)]">
                                            {isApproved
                                                ? 'Setelah anda menerima tempahan pertama, ia akan muncul di sini.'
                                                : 'Tempahan akan dipaparkan di sini setelah akaun anda diluluskan.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {recentBookings.map((booking) => (
                                            <BookingRow key={booking.id} booking={booking} />
                                        ))}
                                    </div>
                                )}

                                {recentBookings.length > 0 && isApproved && (
                                    <div className="border-t border-[color:var(--line)] px-3 py-3 text-center">
                                        <Link
                                            href="/provider/bookings"
                                            className="text-sm font-bold text-[color:var(--green)] hover:text-[color:var(--green-dark)] sm:hidden"
                                        >
                                            Lihat semua tempahan →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick actions */}
                    {showQuickActions && (
                        <div className="flex flex-col gap-6">
                            <div className="provider-card">
                                <div className="provider-card__header">
                                    <h2 className="provider-card__title">Tindakan pantas</h2>
                                </div>

                                <div className="provider-card__body space-y-2">
                                    <Link
                                        href="/provider/services/create"
                                        className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#a9cdb4] hover:shadow-sm"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[color:var(--green)] text-white">
                                            <Icon.Plus style={{ width: 18, height: 18 }} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[color:var(--ink)]">
                                                Tambah perkhidmatan
                                            </span>
                                            <span className="block text-xs text-[color:var(--muted)]">
                                                Tawarkan kerja baru kepada pelanggan
                                            </span>
                                        </span>
                                        <Icon.ArrowRight
                                            className="text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                                            style={{ width: 16, height: 16 }}
                                        />
                                    </Link>

                                    <Link
                                        href="/provider/bookings"
                                        className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#a9cdb4] hover:shadow-sm"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[color:var(--lime)] text-[color:var(--green-dark)]">
                                            <Icon.Calendar style={{ width: 18, height: 18 }} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[color:var(--ink)]">
                                                Urus tempahan
                                            </span>
                                            <span className="block text-xs text-[color:var(--muted)]">
                                                Semak permintaan yang menunggu
                                            </span>
                                        </span>
                                        <Icon.ArrowRight
                                            className="text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                                            style={{ width: 16, height: 16 }}
                                        />
                                    </Link>

                                    <Link
                                        href="/provider/profile"
                                        className="group flex items-center gap-3 rounded-xl border border-[color:var(--line)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#a9cdb4] hover:shadow-sm"
                                    >
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[color:var(--warm)] text-[color:var(--ink)]">
                                            <Icon.Wrench style={{ width: 18, height: 18 }} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold text-[color:var(--ink)]">
                                                Kemaskini profil
                                            </span>
                                            <span className="block text-xs text-[color:var(--muted)]">
                                                Pastikan maklumat anda terkini
                                            </span>
                                        </span>
                                        <Icon.ArrowRight
                                            className="text-[color:var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--green)]"
                                            style={{ width: 16, height: 16 }}
                                        />
                                    </Link>
                                </div>
                            </div>

                            {/* Profile completion meter */}
                            <div className="provider-card overflow-hidden">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--green)] to-[color:var(--green-dark)]" />
                                    <div className="relative p-5 text-white">
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                                            Kekuatan profil
                                        </p>

                                        <div className="mt-2 flex items-end justify-between">
                                            <p
                                                className="font-serif text-3xl"
                                                style={{ letterSpacing: '-0.03em' }}
                                            >
                                                {completeness}%
                                            </p>
                                            <span className="text-3xl opacity-80">⌂</span>
                                        </div>

                                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                                            <div
                                                className="h-full rounded-full bg-[color:var(--lime)] transition-all duration-500"
                                                style={{ width: `${completeness}%` }}
                                            />
                                        </div>

                                        {missingFields.length === 0 ? (
                                            <p className="mt-3 text-xs leading-5 text-emerald-100/90">
                                                Profil anda lengkap! Teruskan beri perkhidmatan terbaik. 🎉
                                            </p>
                                        ) : (
                                            <>
                                                <p className="mt-3 text-xs leading-5 text-emerald-100/90">
                                                    Lengkapkan {missingFields.length} perkara lagi untuk
                                                    meningkatkan peluang anda dipilih:
                                                </p>

                                                <ul className="mt-2 space-y-1.5">
                                                    {missingFields.map((field) => (
                                                        <li
                                                            key={field.key}
                                                            className="flex items-center gap-2 text-xs text-white/95"
                                                        >
                                                            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/15 text-[9px] font-bold">
                                                                !
                                                            </span>
                                                            {field.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        )}

                                        <Link
                                            href="/provider/profile"
                                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
                                        >
                                            {missingFields.length === 0 ? 'Lihat profil' : 'Lengkapkan sekarang'}
                                            <Icon.ArrowRight style={{ width: 12, height: 12 }} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}
        </ProviderLayout>
    );
}