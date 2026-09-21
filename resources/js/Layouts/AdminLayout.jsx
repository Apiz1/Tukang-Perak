import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ---------- Icons ---------- */
const Icon = {
    Menu: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
    ),
    Close: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 5l10 10M15 5L5 15" />
        </svg>
    ),
    Home: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M3 9l7-6 7 6v8a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V9z" />
        </svg>
    ),
    Users: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="7" cy="8" r="3" />
            <path d="M2 17c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
            <path d="M13 6.5a3 3 0 110 6" />
            <path d="M14 17c0-1.9-.6-3.2-1.6-4.1 2.6-.3 5 1.3 5 4.1" />
        </svg>
    ),
    User: (p) => (                                            // 👈 ADD THIS
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
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
    Bell: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M5 8a5 5 0 0110 0v3l1.5 2.5h-13L5 11V8z" />
            <path d="M8.5 15.5a1.5 1.5 0 003 0" />
        </svg>
    ),
    Chevron: (p) => (
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
    ),
    Logout: (p) => (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M10 2h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" />
            <path d="M6 11l3-3-3-3" />
            <path d="M9 8H2" />
        </svg>
    ),
};

/* ---------- Navigation config (plain paths) ---------- */
const navSections = [
    {
        label: 'Utama',
        items: [
            { label: 'Papan pemuka', href: '/admin/dashboard',                 icon: 'Home' },
            { label: 'Tempahan',     href: '/admin/bookings',        icon: 'Calendar' },
        ],
    },
    {
        label: 'Pengurusan',
        items: [
            { label: 'Tukang',   href: '/admin/providers', icon: 'Wrench' },
            { label: 'Pelanggan', href: '/admin/customers', icon: 'Users' },
        ],
    },
];

export default function AdminLayout({ children, title, breadcrumb }) {
    const { auth, url } = usePage().props;
    const user = auth?.user ?? null;

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const userMenuRef = useRef(null);
    const cancelBtnRef = useRef(null);

    /* ---------- Active route check ---------- */
    const isActive = (href) => {
        if (!url) return false;
        if (href === '/admin') return url === '/admin' || url === '/admin/';
        return url === href || url.startsWith(href + '/') || url.startsWith(href + '?');
    };

    /* ---------- Close user menu on outside click / Escape ---------- */
    useEffect(() => {
        if (!userMenuOpen) return;
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        const onKey = (e) => e.key === 'Escape' && setUserMenuOpen(false);
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [userMenuOpen]);

    /* ---------- Close on route change ---------- */
    useEffect(() => router.on('navigate', () => setUserMenuOpen(false)), []);
    useEffect(() => router.on('navigate', () => setMobileOpen(false)), []);

    /* ---------- Logout modal ---------- */
    useEffect(() => {
        if (!showLogoutModal) return;
        const onKey = (e) => {
            if (e.key === 'Escape' && !loggingOut) setShowLogoutModal(false);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        setTimeout(() => cancelBtnRef.current?.focus(), 60);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [showLogoutModal, loggingOut]);

    /* ---------- Persist sidebar collapse state ---------- */
    useEffect(() => {
        const stored = localStorage.getItem('admin_sidebar_collapsed');
        if (stored === 'true') setSidebarCollapsed(true);
    }, []);
    useEffect(() => {
        localStorage.setItem('admin_sidebar_collapsed', String(sidebarCollapsed));
    }, [sidebarCollapsed]);

    const initials = useMemo(() => {
        return user?.name
            ?.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase();
    }, [user?.name]);

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

    return (
        <div className="admin-shell">
            {/* ============ SIDEBAR ============ */}
            <aside
                className="admin-sidebar"
                data-collapsed={sidebarCollapsed}
                data-mobile-open={mobileOpen}
            >
                <Link href="/admin/dashboard" className="admin-sidebar__brand">
                    <span className="admin-sidebar__brand-mark">T</span>
                    <span className="admin-sidebar__brand-name">
                        Tukang<span style={{ color: 'var(--green)' }}>Perak</span>
                        <span className="admin-sidebar__badge">Admin</span>
                    </span>
                </Link>

                <nav className="admin-sidebar__nav">
                    {navSections.map((section) => (
                        <div key={section.label}>
                            <p className="admin-sidebar__section-label">
                                {section.label}
                            </p>

                            {section.items.map((item) => {
                                const ItemIcon = Icon[item.icon];
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="admin-nav-link"
                                        data-active={active}
                                        title={item.label}
                                    >
                                        <span className="admin-nav-link__icon">
                                            <ItemIcon style={{ width: 14, height: 14 }} />
                                        </span>
                                        <span className="admin-nav-link__label">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="admin-sidebar__footer">
                    <p className="admin-sidebar__footer-text">
                        © {new Date().getFullYear()} Tukang Perak
                    </p>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="admin-sidebar__backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ============ MAIN COLUMN ============ */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar__left">
                        {/* Mobile: open sidebar */}
                        <button
                            type="button"
                            className="admin-icon-btn lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                        >
                            <Icon.Menu style={{ width: 18, height: 18 }} />
                        </button>

                        {/* Desktop: collapse toggle */}
                        <button
                            type="button"
                            className="admin-icon-btn hidden lg:grid"
                            onClick={() => setSidebarCollapsed((v) => !v)}
                            aria-label={
                                sidebarCollapsed ? 'Kembangkan menu' : 'Kecilkan menu'
                            }
                        >
                            {sidebarCollapsed ? (
                                <Icon.Menu style={{ width: 18, height: 18 }} />
                            ) : (
                                <Icon.Close style={{ width: 18, height: 18 }} />
                            )}
                        </button>

                        <div className="min-w-0">
                            {breadcrumb && (
                                <p className="admin-page-breadcrumb">{breadcrumb}</p>
                            )}
                            {title && <p className="admin-page-title">{title}</p>}
                        </div>
                    </div>

                    <div className="admin-topbar__right">
                        <button
                            type="button"
                            className="admin-icon-btn"
                            aria-label="Notifikasi"
                        >
                            <Icon.Bell style={{ width: 18, height: 18 }} />
                        </button>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="admin-user-chip"
                                aria-haspopup="menu"
                                aria-expanded={userMenuOpen}
                            >
                                <span className="admin-user-chip__avatar">
                                    {user?.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt=""
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        initials || 'A'
                                    )}
                                </span>

                                <span className="admin-user-chip__name hidden sm:inline">
                                    {user?.name}
                                </span>

                                <Icon.Chevron
                                    style={{ width: 12, height: 12, color: 'var(--muted)' }}
                                />
                            </button>

                            {userMenuOpen && (
                                <div className="admin-dropdown" role="menu">
                                    <div className="admin-dropdown__header">
                                        <p className="admin-dropdown__name">
                                            {user?.name}
                                        </p>
                                        <p className="admin-dropdown__email">
                                            {user?.email}
                                        </p>
                                        <span className="admin-dropdown__role">
                                            ⚙️ Pentadbir
                                        </span>
                                    </div>

                                    <div className="admin-dropdown__body">
                                        <Link
                                            href="/admin/settings"
                                            className="admin-dropdown__item"
                                            role="menuitem"
                                        >
                                            <Icon.User style={{ width: 16, height: 16 }} />
                                            Tetapan akaun
                                        </Link>
                                        <Link
                                            href="/"
                                            className="admin-dropdown__item"
                                            role="menuitem"
                                        >
                                            <Icon.Home style={{ width: 16, height: 16 }} />
                                            Laman utama
                                        </Link>
                                    </div>

                                    <div className="admin-dropdown__footer">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="admin-dropdown__item admin-dropdown__item--danger"
                                            role="menuitem"
                                        >
                                            <Icon.Logout style={{ width: 16, height: 16 }} />
                                            Log keluar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="admin-content">
                    {title && (
                        <div className="admin-page-header">
                            <h1 className="admin-page-heading">{title}</h1>
                        </div>
                    )}
                    {children}
                </main>

                <footer className="admin-footer">
                    <div className="admin-footer__inner">
                        <p>
                            © {new Date().getFullYear()} Tukang Perak Admin. Hak
                            cipta terpelihara.
                        </p>
                        <p>
                            Perlukan bantuan?{' '}
                            <a
                                href="mailto:admin@tukangperak.my"
                                style={{ color: 'var(--green)', fontWeight: 600 }}
                            >
                                admin@tukangperak.my
                            </a>
                        </p>
                    </div>
                </footer>
            </div>

            {/* ============ LOGOUT MODAL ============ */}
            {showLogoutModal && (
                <div
                    className="admin-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-logout-title"
                >
                    <div
                        className="admin-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-modal__body">
                            <div className="admin-modal__icon">
                                <Icon.Logout style={{ width: 22, height: 22 }} />
                            </div>

                            <h2 id="admin-logout-title" className="admin-modal__title">
                                Log keluar?
                            </h2>

                            <p className="admin-modal__text">
                                Anda akan keluar dari akaun pentadbir{' '}
                                <strong style={{ color: 'var(--ink)' }}>
                                    {user?.name}
                                </strong>
                                . Anda boleh log masuk semula pada bila-bila masa.
                            </p>

                            <div className="admin-modal__actions">
                                <button
                                    ref={cancelBtnRef}
                                    type="button"
                                    className="admin-modal__btn admin-modal__btn--ghost"
                                    onClick={() => setShowLogoutModal(false)}
                                    disabled={loggingOut}
                                >
                                    Kekal log masuk
                                </button>
                                <button
                                    type="button"
                                    className="admin-modal__btn admin-modal__btn--danger"
                                    onClick={confirmLogout}
                                    disabled={loggingOut}
                                >
                                    {loggingOut ? 'Sedang log keluar...' : 'Ya, log keluar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}