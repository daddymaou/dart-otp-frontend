'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, friendlyError, type ApiKey, type CreatedApiKey } from '@/lib/api';
import { Badge, Dialog, Input, StickerButton } from '@/components/ui';
import { CopyButton } from '@/components/site';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [isTest, setIsTest] = useState(true);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedApiKey | null>(null);
  const [saved, setSaved] = useState(false);
  const [pendingRevoke, setPendingRevoke] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.keys();
      setKeys(response.api_keys);
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadKeys(); }, [loadKeys]);

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (keyName.trim().length < 2) {
      setError('Give this key a name with at least two characters.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const result = await api.createKey({ name: keyName.trim(), is_test: isTest });
      setCreated(result);
      setSaved(false);
      setDialog(false);
      setKeyName('');
      await loadKeys();
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setCreating(false);
    }
  }

  async function revoke() {
    if (!pendingRevoke) return;
    setRevoking(true);
    try {
      await api.revokeKey(pendingRevoke.id);
      setPendingRevoke(null);
      await loadKeys();
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setRevoking(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading">
        <div><span className="eyebrow"><i /> API ACCESS</span><h1>API keys</h1><p>Create a key for your server. Full keys are shown only once.</p></div>
        <button className="button button-primary" onClick={() => { setError(''); setDialog(true); }} type="button">Create key <span aria-hidden="true">+</span></button>
      </div>
      {error && <p className="dashboard-inline-error" role="alert">{error}</p>}
      <section className="dashboard-panel table-panel">
        <div className="panel-heading"><div><h2>Your keys</h2><p>Never put a live key in browser-side code.</p></div><Badge status="test">{keys.filter((key) => !key.revoked).length} active</Badge></div>
        {loading ? <div className="table-loading" role="status">Loading keys…</div> : keys.length ? (
          <div className="table-scroll">
            <table className="dashboard-table">
              <thead><tr><th>Name</th><th>Key prefix</th><th>Type</th><th>Last used</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {keys.map((item) => (
                  <tr key={item.id}>
                    <td className="table-name">{item.name}</td>
                    <td><code>{item.prefix}••••••</code></td>
                    <td><Badge status={item.is_test ? 'test' : 'verified'}>{item.is_test ? 'test' : 'live'}</Badge></td>
                    <td>{item.last_used_at ? new Date(item.last_used_at).toLocaleDateString() : 'Not used yet'}</td>
                    <td><Badge status={item.revoked ? 'expired' : 'verified'}>{item.revoked ? 'revoked' : 'active'}</Badge></td>
                    <td>{!item.revoked && <button className="text-button text-button-danger" onClick={() => setPendingRevoke(item)} type="button">Revoke</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-art" aria-hidden="true"><span>⌘</span><i>✦</i></div>
            <h3>No keys yet.</h3><p>Create a test key first, then switch to a live key when you are ready.</p>
            <button className="button button-primary" onClick={() => setDialog(true)} type="button">Create your first key</button>
          </div>
        )}
      </section>
      {dialog && (
        <Dialog title="Create an API key" description="Choose a name you will recognize. You can revoke a key later." onClose={() => setDialog(false)}>
          <form className="dialog-form" onSubmit={createKey}>
            <label className="form-field" htmlFor="key-name"><span>Key name</span><Input autoFocus id="key-name" maxLength={80} onChange={(event) => setKeyName(event.target.value)} placeholder="e.g. Production server" value={keyName} /></label>
            <label className="form-field" htmlFor="key-type"><span>Environment</span>
              <select className="form-input" id="key-type" onChange={(event) => setIsTest(event.target.value === 'test')} value={isTest ? 'test' : 'live'}>
                <option value="test">Test — no Telegram messages</option><option value="live">Live — deliver real OTPs</option>
              </select>
            </label>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <StickerButton loading={creating} type="submit">{creating ? 'Creating…' : 'Create key'}</StickerButton>
          </form>
        </Dialog>
      )}
      {created && (
        <Dialog title="Your key is ready" description="Copy it now and store it in your server environment. Dart-OTP will not show the full key again." onClose={() => { if (saved) setCreated(null); }}>
          <div className="one-time-secret">
            <p className="secret-warning">You will not see this key again.</p>
            <code>{created.key}</code>
            <CopyButton value={created.key} label="Copy key" onCopied={() => setSaved(true)} />
            <label className="check-label secret-saved"><input checked={saved} onChange={(event) => setSaved(event.target.checked)} type="checkbox" /><span className="custom-checkbox" aria-hidden="true">{saved ? '✓' : ''}</span><span>I saved this key somewhere secure.</span></label>
            <button className="button button-violet button-full" disabled={!saved} onClick={() => setCreated(null)} type="button">Done</button>
          </div>
        </Dialog>
      )}
      {pendingRevoke && (
        <Dialog title="Revoke this key?" description={`${pendingRevoke.name} will stop working immediately. This cannot be undone.`} onClose={() => setPendingRevoke(null)}>
          <div className="dialog-actions">
            <button className="button button-ghost" onClick={() => setPendingRevoke(null)} type="button">Keep key</button>
            <button className="button button-danger" disabled={revoking} onClick={revoke} type="button">{revoking ? 'Revoking…' : 'Revoke key'}</button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
