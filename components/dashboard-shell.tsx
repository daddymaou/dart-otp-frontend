'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { api, friendlyError, type Tenant } from '@/lib/api';
import { Badge } from '@/components/ui';

const mainLinks = [
  { href: '/dashboard', label: 'Overview', icon: '◫' },
  { href: '/dashboard/keys', label: 'API keys', icon: '⌘' },
  { href: '/dashboard/templates', label: 'Templates', icon: '▤' },
  { href: '/dashboard/logs', label: 'Logs', icon: '≋' },
  { href: '/dashboard/webhooks', label: 'Webhooks', icon: '↗' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙' },
];

const dockLinks = [
  { href: '/dashboard', label: 'Overview', icon: '◫' },
  { href: '/dashboard/keys', label: 'Keys', icon: '⌘' },
  { href: '/dashboard/templates', label: 'Templates', icon: '▤' },
  { href: '/dashboard/logs', label: 'Logs', icon: '≋' },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const redirect = () => router.replace('/login');
    window.addEventListener('dartotp:unauthorized', redirect);
    api.me()
      .then(setTenant)
      .catch((error: unknown) => setLoadError(friendlyError(error)))
      .finally(() => setLoading(false));
    return () => window.removeEventListener('dartotp:unauthorized', redirect);
  }, [router]);

  async function logout() {
    setLoggingOut(true);
    try {
      await api.logout();
      router.replace('/login');
      router.refresh();
    } catch (error) {
      setLoadError(friendlyError(error));
      setLoggingOut(false);
    }
  }

  const plan = tenant?.plan === 'pro' ? 'Pro' : 'Free';

  return (
    <div className="dashboard-layout">
      <a className="skip-link" href="#dashboard-content">Skip to content</a>
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" href="/dashboard">
          <Image src="/assets/brand/logo-512.png" alt="" width={43} height={43} />
          <span>Dart-OTP</span>
        </Link>
        <div className="sidebar-tenant">
          <span className="tenant-avatar">{tenant?.name.slice(0, 1).toUpperCase() ?? 'D'}</span>
          <span className="tenant-name">{tenant?.name || 'Your workspace'}<small>Developer dashboard</small></span>
          <Badge status="pending">{plan}</Badge>
        </div>
        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          <span className="dashboard-nav-label">WORKSPACE</span>
          {mainLinks.map((item) => (
            <Link
              aria-current={pathname === item.href ? 'page' : undefined}
              className={`dashboard-nav-link ${pathname === item.href ? 'dashboard-nav-active' : ''}`}
              href={item.href}
              key={item.href}
            >
              <span aria-hidden="true">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help"><span>Need a hand?</span><Link href="/docs">Read the quickstart ↗</Link></div>
          <button className="sidebar-logout" disabled={loggingOut} onClick={logout} type="button">
            <span aria-hidden="true">↪</span>{loggingOut ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb"><span>Workspace</span><b>/</b><strong>{mainLinks.find((item) => item.href === pathname)?.label ?? 'Dashboard'}</strong></div>
          <div className="dashboard-top-actions">
            <Badge status="pending">{plan} plan</Badge>
            <Link className="dashboard-profile" href="/dashboard/settings" aria-label="Account settings">
              <span className="tenant-avatar">{tenant?.name.slice(0, 1).toUpperCase() ?? 'D'}</span>
              <span className="profile-email">{tenant?.email ?? (loading ? 'Loading account…' : 'Account')}</span>
              <span aria-hidden="true">⌄</span>
            </Link>
          </div>
        </header>
        <main className="dashboard-content" id="dashboard-content">
          {loadError && (
            <div className="dashboard-error" role="alert">
              <span>{loadError}</span>
              <button onClick={() => window.location.reload()} type="button">Try again</button>
            </div>
          )}
          {loading && <div className="dashboard-skeletons" aria-label="Loading workspace">
            <div className="skeleton-line skeleton-line-wide" /><div className="skeleton-grid"><i /><i /><i /><i /></div><div className="skeleton-panel" />
          </div>}
          {!loading && !loadError && children}
        </main>
      </div>
      <nav className="mobile-dock" aria-label="Dashboard navigation">
        {dockLinks.map((item) => (
          <Link
            aria-current={pathname === item.href ? 'page' : undefined}
            className={`dock-link ${pathname === item.href ? 'dock-active' : ''}`}
            href={item.href}
            key={item.href}
          >
            <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
          </Link>
        ))}
        <button
          aria-expanded={moreOpen}
          aria-label="More dashboard pages"
          className={`dock-link ${moreOpen ? 'dock-active' : ''}`}
          onClick={() => setMoreOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true">•••</span><small>More</small>
        </button>
        {moreOpen && <div className="dock-more-menu">
          <Link href="/dashboard/webhooks">Webhooks</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </div>}
      </nav>
    </div>
  );
}
