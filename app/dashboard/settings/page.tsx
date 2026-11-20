'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, api, friendlyError, type Tenant } from '@/lib/api';
import { plans } from '@/lib/plans';
import { Dialog, Input, StickerButton } from '@/components/ui';

export default function SettingsPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typedEmail, setTypedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.me()
      .then(setTenant)
      .catch((requestError: unknown) => setError(friendlyError(requestError)))
      .finally(() => setLoading(false));
  }, []);

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tenant || typedEmail.trim().toLowerCase() !== tenant.email.toLowerCase()) return;
    setDeleting(true);
    setError('');
    try {
      await api.deleteAccount(password);
      router.replace('/');
      router.refresh();
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.code === 'unauthorized') {
        if (/invalid email or password/i.test(requestError.message)) {
          setError('That password is incorrect. Your account has not been deleted.');
        } else {
          router.replace('/login');
        }
      } else {
        setError(friendlyError(requestError));
      }
      setDeleting(false);
    }
  }

  const plan = plans.find((item) => item.id === (tenant?.plan ?? 'free')) ?? plans[0];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading"><div><span className="eyebrow"><i /> ACCOUNT</span><h1>Settings</h1><p>Your account, plan, and a few important controls.</p></div></div>
      {error && <p className="dashboard-inline-error" role="alert">{error}</p>}
      {loading ? <div className="table-loading" role="status">Loading account…</div> : tenant ? (
        <div className="settings-grid">
          <section className="dashboard-panel settings-panel">
            <div className="panel-heading"><div><h2>Account details</h2><p>Workspace and login information</p></div></div>
            <dl className="settings-details">
              <div><dt>Workspace</dt><dd>{tenant.name}</dd></div>
              <div><dt>Email</dt><dd>{tenant.email}</dd></div>
              <div><dt>Account status</dt><dd><span className={`settings-status settings-status-${tenant.status ?? 'active'}`}>{tenant.status ?? 'active'}</span></dd></div>
            </dl>
          </section>
          <section className="dashboard-panel settings-panel plan-settings">
            <div className="panel-heading"><div><h2>Plan and usage</h2><p>Your monthly live-send allowance</p></div><span className="plan-badge">{plan.name}</span></div>
            <div className="plan-settings-quota"><strong>{plan.monthlySends.toLocaleString()}</strong><span>OTP sends per month</span></div>
            <p>Test sends do not count toward this allowance. To discuss a paid plan, contact <a href="mailto:maou4rl@gmail.com">support</a>.</p>
          </section>
          <section className="dashboard-panel danger-zone">
            <div><span className="danger-kicker">DANGER ZONE</span><h2>Delete your account</h2><p>This permanently removes your account and its data, including API keys, templates, logs, and webhooks.</p></div>
            <button className="button button-danger" onClick={() => { setError(''); setTypedEmail(''); setPassword(''); setConfirmOpen(true); }} type="button">Delete account</button>
          </section>
        </div>
      ) : <div className="empty-panel"><h2>Account details are unavailable.</h2><button className="button button-primary" onClick={() => window.location.reload()} type="button">Try again</button></div>}
      {confirmOpen && tenant && (
        <Dialog title="Delete your account?" description="This cannot be undone. Confirm your email and password to continue." onClose={() => setConfirmOpen(false)}>
          <form className="dialog-form" onSubmit={deleteAccount}>
            <label className="form-field" htmlFor="confirm-email"><span>Type your account email: {tenant.email}</span><Input autoFocus id="confirm-email" onChange={(event) => setTypedEmail(event.target.value)} type="email" value={typedEmail} /></label>
            <label className="form-field" htmlFor="confirm-password"><span>Your password</span><Input id="confirm-password" onChange={(event) => setPassword(event.target.value)} type="password" value={password} /></label>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <StickerButton className="button-danger" disabled={typedEmail.trim().toLowerCase() !== tenant.email.toLowerCase() || password.length < 1} loading={deleting} type="submit">Delete my account</StickerButton>
          </form>
        </Dialog>
      )}
    </div>
  );
}
