'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, friendlyError, type DashboardStats, type OtpLog, type Tenant } from '@/lib/api';
import { plans } from '@/lib/plans';
import { Badge, StickerCard } from '@/components/ui';
import { badgeStatus, maskPhone } from '@/lib/display';

const statCards = [
  { key: 'sent', label: 'Sent', accent: 'violet', icon: '↗' },
  { key: 'verified', label: 'Verified', accent: 'mint', icon: '✓' },
  { key: 'failed', label: 'Failed', accent: 'pink', icon: '!' },
  { key: 'today', label: 'Today', accent: 'yellow', icon: '◷' },
] as const;

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<OtpLog[]>([]);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.logs({ page: 1, page_size: 5 }), api.me()])
      .then(([statsResult, logsResult, tenantResult]) => {
        setStats(statsResult);
        setRecent(logsResult.logs);
        setTenant(tenantResult);
      })
      .catch((requestError: unknown) => setError(friendlyError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (error || !stats) {
    return <div className="empty-panel" role="alert"><h1>Overview is unavailable.</h1><p>{error || 'The dashboard did not return usage data.'}</p><button className="button button-primary" onClick={() => window.location.reload()} type="button">Try again</button></div>;
  }

  const quota = plans.find((plan) => plan.id === (tenant?.plan ?? 'free'))?.monthlySends ?? plans[0].monthlySends;
  const usagePercent = Math.min(100, Math.round((stats.sent / quota) * 100));
  const maxDaily = Math.max(1, ...stats.daily.map((day) => day.sent));

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div><span className="eyebrow"><i /> YOUR WORKSPACE</span><h1>Hey{tenant?.name ? `, ${tenant.name}` : ''}. Here&apos;s the picture.</h1><p>Your OTP activity, at a glance.</p></div>
        <div className="welcome-illustration" aria-hidden="true"><span>✓</span><i>✦</i></div>
      </div>
      <div className="stats-grid">
        {statCards.map((card) => (
          <StickerCard accent={card.accent} className="stat-card" key={card.key}>
            <span className={`stat-icon stat-icon-${card.accent}`} aria-hidden="true">{card.icon}</span>
            <span className="stat-label">{card.label}</span>
            <strong>{stats[card.key].toLocaleString()}</strong>
          </StickerCard>
        ))}
      </div>
      <div className="dashboard-two-column">
        <section className="dashboard-panel chart-panel">
          <div className="panel-heading"><div><h2>Last 7 days</h2><p>Sent and verified OTPs</p></div><span className="chart-legend"><i /> Sent <i /> Verified</span></div>
          <div className="bar-chart" role="img" aria-label="Bar chart showing OTP sends and verifications for the last seven days">
            {stats.daily.map((day) => (
              <div className="chart-day" key={day.date}>
                <div className="chart-bars">
                  <i className="chart-bar-sent" style={{ height: `${Math.max(4, (day.sent / maxDaily) * 100)}%` }} title={`${day.sent} sent`} />
                  <i className="chart-bar-verified" style={{ height: `${Math.max(4, (day.verified / maxDaily) * 100)}%` }} title={`${day.verified} verified`} />
                </div>
                <small>{new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="dashboard-panel usage-panel">
          <div className="panel-heading"><div><h2>Monthly usage</h2><p>{tenant?.plan === 'pro' ? 'Pro plan' : 'Free plan'}</p></div><span className="usage-mark">↗</span></div>
          <div className="usage-count"><strong>{stats.sent.toLocaleString()}</strong><span>of {quota.toLocaleString()} sends</span></div>
          <div className="usage-meter" role="meter" aria-label="Monthly sends used" aria-valuenow={stats.sent} aria-valuemin={0} aria-valuemax={quota}><i style={{ width: `${usagePercent}%` }} /></div>
          <p>{usagePercent >= 85 ? 'You are getting close to this plan’s limit.' : 'Usage resets at the start of each month.'}</p>
          <Link href="/dashboard/settings">View plan details <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
      <section className="dashboard-panel recent-panel">
        <div className="panel-heading"><div><h2>Recent activity</h2><p>The latest OTP events from your account</p></div><Link href="/dashboard/logs">View all logs <span aria-hidden="true">↗</span></Link></div>
        {recent.length ? (
          <div className="recent-list">
            {recent.map((item) => (
              <div className="recent-row" key={item.id}>
                <span className={`recent-symbol recent-${item.status}`} aria-hidden="true">{item.status === 'verified' ? '✓' : item.status === 'failed' ? '!' : '↗'}</span>
                <span className="recent-phone">{maskPhone(item.phone)}</span>
                <Badge status={badgeStatus(item.status)}>{item.status.replace('_', ' ')}</Badge>
                {item.is_test && <Badge status="test">test</Badge>}
                <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time>
              </div>
            ))}
          </div>
        ) : <p className="empty-inline">No OTP activity yet. Create a key and make your first request.</p>}
      </section>
    </div>
  );
}
