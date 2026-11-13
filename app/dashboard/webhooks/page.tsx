'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, friendlyError, type Webhook } from '@/lib/api';
import { Badge, Checkbox, Dialog, Input, StickerButton } from '@/components/ui';
import { CopyButton } from '@/components/site';

const webhookEvents = ['otp.sent', 'otp.verified', 'otp.failed', 'otp.expired'];

type CreatedWebhook = Webhook & { secret: string };

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState<string[]>(['otp.sent', 'otp.verified']);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState<CreatedWebhook | null>(null);
  const [saved, setSaved] = useState(false);
  const [deliveriesFor, setDeliveriesFor] = useState<string | null>(null);
  const [deliveries, setDeliveries] = useState<Array<{ id: string; event: string; status: string; attempts: number; created_at: string }>>([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Webhook | null>(null);

  const loadWebhooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.webhooks();
      setWebhooks(response.webhooks);
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadWebhooks(); }, [loadWebhooks]);

  async function createWebhook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^https?:\/\/.+/i.test(url)) {
      setError('Enter a valid http or https URL.');
      return;
    }
    if (!events.length) {
      setError('Choose at least one event.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const result = await api.createWebhook({ url: url.trim(), events });
      setCreated(result);
      setSaved(false);
      setCreateOpen(false);
      setUrl('');
      await loadWebhooks();
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(webhook: Webhook) {
    setError('');
    try {
      await api.updateWebhook(webhook.id, { url: webhook.url, events: webhook.events, active: !webhook.active });
      await loadWebhooks();
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  }

  async function showDeliveries(webhook: Webhook) {
    setDeliveriesFor(webhook.id);
    setDeliveryLoading(true);
    setError('');
    try {
      const response = await api.webhookDeliveries(webhook.id);
      setDeliveries(response.deliveries);
    } catch (requestError) {
      setError(friendlyError(requestError));
      setDeliveries([]);
    } finally {
      setDeliveryLoading(false);
    }
  }

  async function deleteWebhook() {
    if (!pendingDelete) return;
    try {
      await api.deleteWebhook(pendingDelete.id);
      setPendingDelete(null);
      if (deliveriesFor === pendingDelete.id) setDeliveriesFor(null);
      await loadWebhooks();
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading">
        <div><span className="eyebrow"><i /> EVENT DELIVERY</span><h1>Webhooks</h1><p>Send OTP events to an endpoint you control.</p></div>
        <button className="button button-primary" onClick={() => { setError(''); setCreateOpen(true); }} type="button">Add webhook <span aria-hidden="true">+</span></button>
      </div>
      {error && <p className="dashboard-inline-error" role="alert">{error}</p>}
      {loading ? <div className="table-loading" role="status">Loading webhooks…</div> : webhooks.length ? (
        <div className="webhook-list">
          {webhooks.map((webhook) => (
            <section className="dashboard-panel webhook-card" key={webhook.id}>
              <div className="webhook-card-main">
                <span className="webhook-icon" aria-hidden="true">↗</span>
                <div className="webhook-url"><strong>{webhook.url}</strong><span>{webhook.events.join(' · ')}</span></div>
                <Badge status={webhook.active === false ? 'expired' : 'verified'}>{webhook.active === false ? 'paused' : 'active'}</Badge>
              </div>
              <div className="webhook-actions">
                <button className="text-button" onClick={() => void showDeliveries(webhook)} type="button">Delivery log</button>
                <button className="text-button" onClick={() => void toggleActive(webhook)} type="button">{webhook.active === false ? 'Activate' : 'Pause'}</button>
                <button className="text-button text-button-danger" onClick={() => setPendingDelete(webhook)} type="button">Delete</button>
              </div>
              {deliveriesFor === webhook.id && (
                <div className="delivery-log">
                  <div className="panel-heading"><h3>Recent deliveries</h3><button className="text-button" onClick={() => setDeliveriesFor(null)} type="button">Close</button></div>
                  {deliveryLoading ? <p>Loading deliveries…</p> : deliveries.length ? deliveries.map((item) => (
                    <div className="delivery-row" key={item.id}><span>{item.event}</span><Badge status={item.status === 'delivered' ? 'verified' : item.status === 'failed' ? 'failed' : 'pending'}>{item.status}</Badge><span>{item.attempts} attempts</span><time>{new Date(item.created_at).toLocaleString()}</time></div>
                  )) : <p>No delivery attempts yet.</p>}
                </div>
              )}
            </section>
          ))}
        </div>
      ) : <div className="dashboard-panel empty-state"><div className="empty-art" aria-hidden="true"><span>↗</span><i>✦</i></div><h3>No webhooks yet.</h3><p>Add an endpoint to receive events when OTPs change status.</p><button className="button button-primary" onClick={() => setCreateOpen(true)} type="button">Add a webhook</button></div>}
      {createOpen && (
        <Dialog title="Add a webhook" description="Choose a secure endpoint and the events you want to receive." onClose={() => setCreateOpen(false)}>
          <form className="dialog-form" onSubmit={createWebhook}>
            <label className="form-field" htmlFor="webhook-url"><span>Endpoint URL</span><Input autoFocus id="webhook-url" onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/hooks/dart-otp" type="url" value={url} /></label>
            <fieldset className="event-choices"><legend>Events</legend>{webhookEvents.map((item) => <Checkbox checked={events.includes(item)} key={item} label={item} onChange={(checked) => setEvents((current) => checked ? [...current, item] : current.filter((value) => value !== item))} />)}</fieldset>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <StickerButton loading={creating} type="submit">{creating ? 'Creating…' : 'Create webhook'}</StickerButton>
          </form>
        </Dialog>
      )}
      {created && (
        <Dialog title="Webhook created" description="Save this signing secret now. It is only shown once." onClose={() => { if (saved) setCreated(null); }}>
          <div className="one-time-secret"><p className="secret-warning">Keep this secret out of client-side code.</p><code>{created.secret}</code><CopyButton value={created.secret} label="Copy secret" onCopied={() => setSaved(true)} /><button className="button button-violet button-full" disabled={!saved} onClick={() => setCreated(null)} type="button">Done</button></div>
        </Dialog>
      )}
      {pendingDelete && (
        <Dialog title="Delete this webhook?" description="New events will no longer be sent to this endpoint." onClose={() => setPendingDelete(null)}>
          <div className="dialog-actions"><button className="button button-ghost" onClick={() => setPendingDelete(null)} type="button">Keep webhook</button><button className="button button-danger" onClick={deleteWebhook} type="button">Delete webhook</button></div>
        </Dialog>
      )}
    </div>
  );
}
