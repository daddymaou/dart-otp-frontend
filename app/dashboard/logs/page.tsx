'use client';

import { useEffect, useState } from 'react';
import { api, friendlyError, type OtpLog } from '@/lib/api';
import { Badge } from '@/components/ui';
import { CopyButton } from '@/components/site';
import { badgeStatus, maskPhone } from '@/lib/display';

export default function LogsPage() {
  const [rows, setRows] = useState<OtpLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pageSize = 25;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api.logs({ page, page_size: pageSize, status: status || undefined, phone: phone || undefined })
      .then((response) => {
        if (!active) return;
        setRows(response.logs);
        setTotal(response.total);
      })
      .catch((requestError: unknown) => {
        if (active) setError(friendlyError(requestError));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, phone, status]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading">
        <div><span className="eyebrow"><i /> DELIVERY HISTORY</span><h1>Logs</h1><p>Filter delivery and verification activity from your account.</p></div>
      </div>
      <section className="dashboard-panel log-panel">
        <div className="log-filters">
          <label className="filter-field" htmlFor="log-status"><span>Status</span>
            <select className="form-input" id="log-status" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}>
              <option value="">All statuses</option><option value="sent">Sent</option><option value="verified">Verified</option><option value="failed">Failed</option><option value="expired">Expired</option>
            </select>
          </label>
          <label className="filter-field" htmlFor="log-phone"><span>Phone</span>
            <input className="form-input" id="log-phone" onChange={(event) => { setPhone(event.target.value); setPage(1); }} placeholder="Filter by phone" type="search" value={phone} />
          </label>
          <label className="check-label reveal-toggle"><input checked={reveal} onChange={(event) => setReveal(event.target.checked)} type="checkbox" /><span className="custom-checkbox" aria-hidden="true">{reveal ? '✓' : ''}</span><span>Reveal phone numbers</span></label>
        </div>
        {error && <p className="dashboard-inline-error" role="alert">{error}</p>}
        {loading ? <div className="table-loading" role="status">Loading logs…</div> : rows.length ? (
          <>
            <div className="table-scroll log-table-scroll">
              <table className="dashboard-table">
                <thead><tr><th>Phone</th><th>Status</th><th>Type</th><th>Created</th><th>Expires</th><th>OTP ID</th></tr></thead>
                <tbody>{rows.map((row) => <tr key={row.id}>
                  <td className="table-name">{reveal ? row.phone : maskPhone(row.phone)}</td>
                  <td><Badge status={badgeStatus(row.status)}>{row.status.replace('_', ' ')}</Badge></td>
                  <td>{row.is_test ? <Badge status="test">test</Badge> : <span>live</span>}</td>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>{new Date(row.expires_at).toLocaleString()}</td>
                  <td><span className="id-copy"><code>{row.id.slice(0, 8)}…</code><CopyButton value={row.id} label="Copy ID" /></span></td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="pagination">
              <span>{total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}</span>
              <div><button className="button button-ghost" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} type="button">Previous</button><span>Page {page} of {pages}</span><button className="button button-ghost" disabled={page >= pages} onClick={() => setPage((current) => current + 1)} type="button">Next</button></div>
            </div>
            <div className="log-mobile-cards">{rows.map((row) => (
              <article className="log-mobile-card" key={`mobile-${row.id}`}>
                <div><strong>{reveal ? row.phone : maskPhone(row.phone)}</strong><Badge status={badgeStatus(row.status)}>{row.status.replace('_', ' ')}</Badge></div>
                <p>{new Date(row.created_at).toLocaleString()} · {row.is_test ? 'test' : 'live'}</p>
                <span><code>{row.id}</code><CopyButton value={row.id} label="Copy ID" /></span>
              </article>
            ))}</div>
          </>
        ) : (
          <div className="empty-state"><div className="empty-art" aria-hidden="true"><span>≋</span><i>✦</i></div><h3>No matching logs.</h3><p>Try a different filter, or send your first OTP to see it here.</p></div>
        )}
      </section>
    </div>
  );
}
