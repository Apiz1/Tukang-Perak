import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ---------- Guest navigation (public pages) ---------- */
const guestNavItems = [
    { label: 'Home',         href: '/' },
    { label: 'Cari Tukang',  href: '/browse' },
    { label: 'Cara Kerja',   href: '/#cara-kerja' },
    { label: 'Untuk Tukang', href: '/register?role=provider' },
];

/* ---------- Logged-in navigation ---------- */
const authNavItems = [
    { label: 'Home',          href: '/' },
    { label: 'Papan Pemuka',  href: '/dashboard' },
    { label: 'Cari Tukang',   href: '/browse' },
    { label: 'Tempahan Saya', href: '/customer/bookings' },
];

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const menuRef = useRef(null);
    const modalRef = useRef(null);
    const cancelBtnRef = useRef(null);

    const navItems = user ? authNavItems : guestNavItems;

    /* ---------- Close dropdown on outside click ---------- */
    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [menuOpen]);

    /* ---------- Close dropdown on route change ---------- */
    useEffect(() => {
        return router.on('navigate', () => setMenuOpen(false));
    }, []);

    /* ---------- Modal: escape + scroll lock + focus ---------- */
    useEffect(() => {
        if (!showLogoutModal) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape' && !loggingOut) {
                setShowLogoutModal(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        setTimeout(() => cancelBtnRef.current?.focus(), 50);

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [showLogoutModal, loggingOut]);

    /* ---------- Logout ---------- */
    const openLogoutModal = () => {
        setMenuOpen(false);
        setShowLogoutModal(true);
    };

    const closeLogoutModal = () => {
        if (loggingOut) return;
        setShowLogoutModal(false);
    };

    const confirmLogout = () => {
        setLoggingOut(true);
        router.post(
            route('logout'),
            {},
            {
                onFinish: () => {
                    setLoggingOut(false);
                    setShowLogoutModal(false);
                },
            }
        );
    };

    const initials = user?.name
        ?.split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
                <nav
                    className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8"
                    aria-label="Navigasi utama"
                >
                    {/* ---------- Brand ---------- */}
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 font-semibold tracking-tight"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm transition-transform group-hover:-rotate-6">
                            T
                        </span>
                        <span className="text-lg">
                            Tukang<span className="text-emerald-700">Perak</span>
                        </span>
                    </Link>

                    {/* ---------- Center nav ---------- */}
                    <div className="hidden items-center gap-7 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-sm font-medium text-stone-600 transition-colors hover:text-emerald-700"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* ---------- Right side ---------- */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            /* ============ LOGGED IN ============ */
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((open) => !open)}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-emerald-200 hover:bg-stone-50 sm:gap-2.5 sm:pr-3"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt=""
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                                            {initials || 'U'}
                                        </span>
                                    )}

                                    <span className="hidden max-w-[120px] truncate sm:inline">
                                        {user.name}
                                    </span>

                                    <svg
                                        viewBox="0 0 12 12"
                                        className={`h-3 w-3 text-stone-500 transition-transform ${
                                            menuOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2.5 4.5L6 8l3.5-3.5" />
                                    </svg>
                                </button>

                                {/* ---------- Dropdown ---------- */}
                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-900/10"
                                    >
                                        {/* User header */}
                                        <div className="border-b border-stone-100 px-4 py-3.5">
                                            <p className="truncate text-sm font-semibold text-stone-900">
                                                {user.name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-stone-500">
                                                {user.email}
                                            </p>
                                            {user.role && (
                                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                                    {user.role === 'provider'
                                                        ? '🔧 Tukang'
                                                        : user.role === 'admin'
                                                        ? '⚙️ Pentadbir'
                                                        : '👤 Pelanggan'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Menu items */}
                                            
                                        <div className="py-1.5">
                                            <DropdownLink href="/">
                                                Home
                                            </DropdownLink>

                                            <DropdownLink href="/dashboard">
                                                Papan pemuka
                                            </DropdownLink>

                                            {user.role === 'provider' && (
                                                <>
                                                    <DropdownLink href="/provider/profile">
                                                        Profil tukang
                                                    </DropdownLink>
                                                    <DropdownLink href="/provider/services">
                                                        Perkhidmatan saya
                                                    </DropdownLink>
                                                </>
                                            )}

                                            {user.role === 'customer' && (
                                                <>
                                                    <DropdownLink href="/customer/bookings">
                                                        Tempahan saya
                                                    </DropdownLink>
                                                    <DropdownLink href="/favorites">
                                                        Tukang disimpan
                                                    </DropdownLink>
                                                </>
                                            )}

                                            {user.role === 'admin' && (
                                                <DropdownLink href="/admin/providers">
                                                    Urus tukang
                                                </DropdownLink>
                                            )}

                                            <DropdownLink href="/profile">
                                                Tetapan akaun
                                            </DropdownLink>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-stone-100 p-1.5">
                                            <button
                                                type="button"
                                                onClick={openLogoutModal}
                                                role="menuitem"
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                                            >
                                                <svg
                                                    viewBox="0 0 16 16"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" />
                                                    <path d="M6 11l3-3-3-3" />
                                                    <path d="M9 8H2" />
                                                </svg>
                                                Log keluar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ============ GUEST ============ */
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-200 sm:px-4"
                                >
                                    Log masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-lg bg-emerald-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow md:px-4"
                                >
                                    Daftar percuma
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-1">{children}</main>

            {/* ---------- Footer ---------- */}
            <footer className="border-t border-stone-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
                    <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
                        <div className="max-w-sm">
                            <Link
                                href="/"
                                className="text-lg font-semibold tracking-tight"
                            >
                                Tukang<span className="text-emerald-700">Perak</span>
                            </Link>
                            <p className="mt-3 text-sm leading-6 text-stone-600">
                                Temui tukang tempatan yang boleh dipercayai untuk
                                setiap kerja di rumah anda.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold">Terokai</h2>
                            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
                                <Link href="/browse" className="hover:text-emerald-700">
                                    Cari perkhidmatan
                                </Link>
                                <Link href="/#cara-kerja" className="hover:text-emerald-700">
                                    Cara ia berfungsi
                                </Link>
                                <Link href="/register" className="hover:text-emerald-700">
                                    Sertai sebagai tukang
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold">Bantuan</h2>
                            <div className="mt-4 flex flex-col gap-3 text-sm text-stone-600">
                                <a
                                    href="mailto:hello@tukangperak.my"
                                    className="hover:text-emerald-700"
                                >
                                    hello@tukangperak.my
                                </a>
                                <Link href="/#faq" className="hover:text-emerald-700">
                                    Soalan lazim
                                </Link>
                                <Link href="/#privacy" className="hover:text-emerald-700">
                                    Privasi & terma
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-2 border-t border-stone-100 pt-6 text-xs text-stone-500 sm:flex-row sm:justify-between">
                        <p>© {new Date().getFullYear()} Tukang Perak. Hak cipta terpelihara.</p>
                        <p>Dibina untuk komuniti Perak.</p>
                    </div>
                </div>
            </footer>

            {/* ================= LOGOUT CONFIRMATION MODAL ================= */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity"
                        onClick={closeLogoutModal}
                        aria-hidden="true"
                    />

                    <div
                        ref={modalRef}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/20"
                        style={{
                            animation:
                                'modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <div className="p-7 sm:p-8">
                            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50">
                                <svg
                                    viewBox="0 0 20 20"
                                    className="h-7 w-7 text-rose-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4" />
                                    <path d="M8 14l4-4-4-4" />
                                    <path d="M12 10H2" />
                                </svg>
                            </div>

                            <h2
                                id="logout-modal-title"
                                className="mt-5 text-center font-serif text-2xl tracking-tight text-stone-900"
                            >
                                Log keluar?
                            </h2>

                            <p className="mt-3 text-center text-sm leading-6 text-stone-600">
                                Anda akan keluar dari akaun{' '}
                                <span className="font-semibold text-stone-800">
                                    {user?.name}
                                </span>
                                . Anda boleh log masuk semula pada bila-bila masa.
                            </p>

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    ref={cancelBtnRef}
                                    onClick={closeLogoutModal}
                                    disabled={loggingOut}
                                    className="w-full rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1"
                                >
                                    Kekal log masuk
                                </button>

                                <button
                                    type="button"
                                    onClick={confirmLogout}
                                    disabled={loggingOut}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-900/10 transition hover:bg-rose-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:w-auto sm:flex-1"
                                >
                                    {loggingOut ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Sedang log keluar...
                                        </>
                                    ) : (
                                        'Ya, log keluar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

/* ---------- Small helper for dropdown links ---------- */
function DropdownLink({ href, children }) {
    return (
        <Link
            href={href}
            role="menuitem"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-emerald-700"
        >
            {children}
        </Link>
    );
}