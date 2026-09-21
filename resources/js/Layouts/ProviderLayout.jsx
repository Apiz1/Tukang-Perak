import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ---------- Inline SVG icons (keeps deps zero) ---------- */
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
    Calendar: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="3" y="4" width="14" height="13" rx="2" />
            <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
    ),
    Wrench: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <path d="M14.7 3.3a3.5 3.5 0 00-4.6 4.6L4 14l2 2 6.1-6.1a3.5 3.5 0 004.6-4.6l-2.2 2.2-1.9-.3-.3-1.9 2.4-2z" />
        </svg>
    ),
    User: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <circle cx="10" cy="7" r="3" />
            <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
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
    Lock: (p) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"
             strokeLinecap="round" strokeLinejoin="round" {...p}>
            <rect x="4" y="9" width="12" height="8" rx="2" />
            <path d="M7 9V6.5a3 3 0 116 0V9" />
        </svg>
    ),
};

/* ---------- Navigation config — plain paths ---------- */
/* 🆕 `requiresApproved: true` marks items that should only be shown
   when the provider's profile status is "approved". */
const navSections = [
    {
        label: 'Utama',
        items: [
            { label: 'Papan pemuka', href: '/provider/dashboard',           icon: 'Home' },
            { label: 'Tempahan',     href: '/provider/bookings',  icon: 'Calendar', requiresApproved: true },
        ],
    },
    {
        label: 'Perkhidmatan',
        items: [
            { label: 'Perkhidmatan saya', href: '/provider/services', icon: 'Wrench', requiresApproved: true },
            { label: 'Profil tukang',     href: '/provider/profile',  icon: 'User' },
        ],
    },
];

export default function ProviderLayout({ children, title, breadcrumb }) {
    const { auth, url } = usePage().props;
    const user = auth?.user ?? null;

    /* 🆕 Determine whether the provider is approved.
       `provider_status` is shared via HandleInertiaRequests.
       Fallback to `user.providerProfile?.status` in case you
       already pass it that way. */
    const providerStatus =
        user?.provider_status ?? user?.providerProfile?.status ?? null;
    const isApproved = providerStatus === 'approved';

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const userMenuRef = useRef(null);
    const cancelBtnRef = useRef(null);

    /* ---------- Active route check using current URL ---------- */
    const isActive = (href) => {
        if (!url) return false;
        if (href === '/provider') return url === '/provider' || url === '/provider/';
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

    /* ---------- Close user menu on route change ---------- */
    useEffect(() => router.on('navigate', () => setUserMenuOpen(false)), []);

    /* ---------- Close mobile sidebar on route change ---------- */
    useEffect(() => router.on('navigate', () => setMobileOpen(false)), []);

    /* ---------- Logout modal: escape + scroll lock + autofocus ---------- */
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
        const stored = localStorage.getItem('provider_sidebar_collapsed');
        if (stored === 'true') setSidebarCollapsed(true);
    }, []);
    useEffect(() => {
        localStorage.setItem('provider_sidebar_collapsed', String(sidebarCollapsed));
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
        <div className="provider-shell">
            {/* ============ SIDEBAR ============ */}
            <aside
                className="provider-sidebar"
                data-collapsed={sidebarCollapsed}
                data-mobile-open={mobileOpen}
            >
                <Link href="/provider/dashboard" className="provider-sidebar__brand">
                    <span className="provider-sidebar__brand-mark">T</span>
                    <span className="provider-sidebar__brand-name">
                        Tukang<span style={{ color: 'var(--green)' }}>Perak</span>
                    </span>
                </Link>

                {/* 🆕 Nav — filters out `requiresApproved` items when not approved */}
                <nav className="provider-sidebar__nav">
                    {navSections.map((section) => {
                        const visibleItems = section.items.filter(
                            (item) => !item.requiresApproved || isApproved
                        );

                        // Hide the whole section if nothing is visible
                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.label}>
                                <p className="provider-sidebar__section-label">
                                    {section.label}
                                </p>

                                {visibleItems.map((item) => {
                                    const ItemIcon = Icon[item.icon];
                                    const active = isActive(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="provider-nav-link"
                                            data-active={active}
                                            title={item.label}
                                        >
                                            <span className="provider-nav-link__icon">
                                                <ItemIcon style={{ width: 14, height: 14 }} />
                                            </span>
                                            <span className="provider-nav-link__label">
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}

                    {/* 🆕 Non-approved hint — tells the provider why some
                        items are missing, so the reduced nav doesn't feel broken */}
                    {!isApproved && providerStatus && (
                        <div
                            className="mt-4 flex items-start gap-2.5 rounded-xl border border-dashed border-[color:var(--line)] bg-white/60 p-3"
                            title={
                                providerStatus === 'pending'
                                    ? 'Akaun anda sedang disemak'
                                    : 'Akaun anda belum diluluskan'
                            }
                        >
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[color:var(--warm)] text-[color:var(--ink)]">
                                <Icon.Lock style={{ width: 13, height: 13 }} />
                            </span>
                            <span className="provider-sidebar__footer-text !text-[0.7rem] leading-snug text-[color:var(--muted)]">
                                {providerStatus === 'pending'
                                    ? 'Sebahagian menu tersembunyi sehingga akaun anda diluluskan.'
                                    : providerStatus === 'rejected'
                                    ? 'Akses terhad. Hubungi sokongan untuk bantuan.'
                                    : 'Akses terhad.'}
                            </span>
                        </div>
                    )}
                </nav>

                <div className="provider-sidebar__footer">
                    <p className="provider-sidebar__footer-text">
                        © {new Date().getFullYear()} Tukang Perak
                    </p>
                </div>
            </aside>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="provider-sidebar__backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ============ MAIN COLUMN ============ */}
            <div className="provider-main">
                <header className="provider-topbar">
                    <div className="provider-topbar__left">
                        <button
                            type="button"
                            className="provider-icon-btn lg:hidden"
                            onClick={() => setMobileOpen(true)}
                            aria-label="Buka menu"
                        >
                            <Icon.Menu style={{ width: 18, height: 18 }} />
                        </button>

                        <button
                            type="button"
                            className="provider-icon-btn hidden lg:grid"
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
                                <p className="provider-page-breadcrumb">{breadcrumb}</p>
                            )}
                            {title && <p className="provider-page-title">{title}</p>}
                        </div>
                    </div>

                    <div className="provider-topbar__right">
                        <button
                            type="button"
                            className="provider-icon-btn"
                            aria-label="Notifikasi"
                        >
                            <Icon.Bell style={{ width: 18, height: 18 }} />
                        </button>

                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="provider-user-chip"
                                aria-haspopup="menu"
                                aria-expanded={userMenuOpen}
                            >
                                <span className="provider-user-chip__avatar">
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
                                        initials || 'U'
                                    )}
                                </span>

                                <span className="provider-user-chip__name hidden sm:inline">
                                    {user?.name}
                                </span>

                                <Icon.Chevron
                                    style={{ width: 12, height: 12, color: 'var(--muted)' }}
                                />
                            </button>

                            {userMenuOpen && (
                                <div className="provider-dropdown" role="menu">
                                    <div className="provider-dropdown__header">
                                        <p className="provider-dropdown__name">
                                            {user?.name}
                                        </p>
                                        <p className="provider-dropdown__email">
                                            {user?.email}
                                        </p>
                                        {user?.role && (
                                            <span className="provider-dropdown__role">
                                                {user.role === 'provider'
                                                    ? '🔧 Tukang'
                                                    : '👤 Pelanggan'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="provider-dropdown__body">
                                        <Link
                                           href={route('provider.profile.edit')}
                                            className="provider-dropdown__item"
                                            role="menuitem"
                                        >
                                            <Icon.User style={{ width: 16, height: 16 }} />
                                            Tetapan akaun
                                        </Link>
                                        <Link
                                            href="/"
                                            className="provider-dropdown__item"
                                            role="menuitem"
                                        >
                                            <Icon.Home style={{ width: 16, height: 16 }} />
                                            Laman utama
                                        </Link>
                                    </div>

                                    <div className="provider-dropdown__footer">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                setShowLogoutModal(true);
                                            }}
                                            className="provider-dropdown__item provider-dropdown__item--danger"
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

                <main className="provider-content">
                    {title && (
                        <div className="provider-page-header">
                            <h1 className="provider-page-heading">{title}</h1>
                        </div>
                    )}
                    {children}
                </main>

                <footer className="provider-footer">
                    <div className="provider-footer__inner">
                        <p>
                            © {new Date().getFullYear()} Tukang Perak. Hak cipta
                            terpelihara.
                        </p>
                        <p>
                            Perlukan bantuan?{' '}
                            <a
                                href="mailto:hello@tukangperak.my"
                                style={{ color: 'var(--green)', fontWeight: 600 }}
                            >
                                hello@tukangperak.my
                            </a>
                        </p>
                    </div>
                </footer>
            </div>

            {/* ============ LOGOUT MODAL ============ */}
            {showLogoutModal && (
                <div
                    className="provider-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="provider-logout-title"
                >
                    <div
                        className="provider-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="provider-modal__body">
                            <div className="provider-modal__icon">
                                <Icon.Logout style={{ width: 22, height: 22 }} />
                            </div>

                            <h2
                                id="provider-logout-title"
                                className="provider-modal__title"
                            >
                                Log keluar?
                            </h2>

                            <p className="provider-modal__text">
                                Anda akan keluar dari akaun{' '}
                                <strong style={{ color: 'var(--ink)' }}>
                                    {user?.name}
                                </strong>
                                . Anda boleh log masuk semula pada bila-bila masa.
                            </p>

                            <div className="provider-modal__actions">
                                <button
                                    ref={cancelBtnRef}
                                    type="button"
                                    className="provider-modal__btn provider-modal__btn--ghost"
                                    onClick={() => setShowLogoutModal(false)}
                                    disabled={loggingOut}
                                >
                                    Kekal log masuk
                                </button>
                                <button
                                    type="button"
                                    className="provider-modal__btn provider-modal__btn--danger"
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