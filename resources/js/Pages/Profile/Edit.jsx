import { usePage, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProviderLayout from '@/Layouts/ProviderLayout';
import MainLayout from '@/Layouts/MainLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

/* ---------- Small icons ---------- */
const Icon = {
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        </svg>
    ),
    Lock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="4" y="9" width="12" height="8" rx="2" />
            <path d="M7 9V6.5a3 3 0 116 0V9" />
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
};

const layoutByRole = {
    admin: AdminLayout,
    provider: ProviderLayout,
    customer: MainLayout,
};

/* ---------- Section card ---------- */
function SectionCard({ icon, title, subtitle, children, tone = 'default' }) {
    const toneClasses = {
        default: 'bg-[color:var(--lime)] text-[color:var(--green-dark)]',
        amber: 'bg-amber-50 text-amber-700',
        rose: 'bg-rose-50 text-rose-700',
        sky: 'bg-sky-50 text-sky-700',
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-start gap-4 border-b border-stone-200 px-5 py-4 sm:px-6 sm:py-5">
                <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses[tone]}`}
                >
                    {icon}
                </span>
                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-stone-900">{title}</h2>
                    {subtitle && (
                        <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>
                    )}
                </div>
            </div>

            <div className="p-5 sm:p-6">
                {children}
            </div>
        </div>
    );
}

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const role = user?.role ?? 'customer';

    const Layout = layoutByRole[role] ?? MainLayout;

    /* Layout props vary per role (provider/admin layouts take a title) */
    const layoutProps =
        role === 'customer'
            ? {}
            : { title: 'Tetapan Akaun', breadcrumb: 'Tetapan / Akaun' };

    return (
        <Layout {...layoutProps}>
            <Head title="Tetapan Akaun" />

            {/* ---------- Page header ---------- */}
            <div className="mb-6">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--green)]">
                    <span className="h-px w-5 bg-[color:var(--green)]" />
                    TETAPAN
                </p>
                <h1 className="mt-2 font-serif text-3xl tracking-tight text-stone-900">
                    Tetapan akaun
                </h1>
                <p className="mt-1 text-sm text-stone-600">
                    Urus maklumat peribadi, kata laluan, dan keselamatan akaun anda.
                </p>
            </div>

            {/* ---------- Two-column grid: content + sidebar info ---------- */}
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
                {/* LEFT: form sections */}
                <div className="flex flex-col gap-6">
                    <SectionCard
                        icon={<Icon.User style={{ width: 18, height: 18 }} />}
                        title="Maklumat profil"
                        subtitle="Nama dan alamat e-mel anda"
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </SectionCard>

                    <SectionCard
                        icon={<Icon.Lock style={{ width: 18, height: 18 }} />}
                        title="Kata laluan"
                        subtitle="Pastikan akaun anda menggunakan kata laluan yang selamat"
                        tone="sky"
                    >
                        <UpdatePasswordForm />
                    </SectionCard>

                    <SectionCard
                        icon={<Icon.Alert style={{ width: 18, height: 18 }} />}
                        title="Padam akaun"
                        subtitle="Setelah dipadam, semua data tidak boleh dipulihkan"
                        tone="rose"
                    >
                        <DeleteUserForm />
                    </SectionCard>
                </div>

                {/* RIGHT: sidebar info */}
                <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
                    {/* Profile summary card */}
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--green)] to-[color:var(--green-dark)]" />
                            <div className="relative p-5 text-white">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                                    AKAUN ANDA
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/15 text-base font-bold text-white">
                                        {user?.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            (user?.name ?? 'U').charAt(0).toUpperCase()
                                        )}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold">
                                            {user?.name ?? 'Pengguna'}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-emerald-100/90">
                                            {user?.email ?? ''}
                                        </p>
                                    </div>
                                </div>

                                {user?.role && (
                                    <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                                        {user.role === 'provider'
                                            ? '🔧 Tukang'
                                            : user.role === 'admin'
                                            ? '⚙️ Pentadbir'
                                            : '👤 Pelanggan'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security tip card */}
                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                        <div className="flex items-start gap-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--green)] text-white">
                                <Icon.Shield style={{ width: 16, height: 16 }} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-stone-900">
                                    Petua keselamatan
                                </p>
                                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Gunakan kata laluan sekurang-kurangnya 8 aksara.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Jangan kongsi akaun dengan orang lain.
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600" />
                                        Kemas kini e-mel jika anda tukar alamat.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </Layout>
    );
}