'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, friendlyError, type OtpTemplate, type PendingLinkResult } from '@/lib/api';
import { Badge, Dialog, Input, StickerButton, Textarea } from '@/components/ui';
import { CopyButton } from '@/components/site';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<OtpTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<OtpTemplate | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState('');
  const [body, setBody] = useState('Your verification code is {{code}}. Do not share it with anyone.');
  const [saving, setSaving] = useState(false);
  const [testTemplate, setTestTemplate] = useState<OtpTemplate | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<PendingLinkResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<OtpTemplate | null>(null);

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.templates();
      setTemplates(response.templates);
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTemplates(); }, [loadTemplates]);

  function openEditor(template?: OtpTemplate) {
    setEditing(template ?? null);
    setName(template?.name ?? '');
    setBody(template?.body ?? 'Your verification code is {{code}}. Do not share it with anyone.');
    setError('');
    setEditorOpen(true);
  }

  async function saveTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Add a name for this template.');
      return;
    }
    if (!body.includes('{{code}}')) {
      setError('Add the {{code}} placeholder so the one-time code appears in the message.');
      return;
    }
    if (body.length > 300) {
      setError('Keep the message to 300 characters or fewer.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) await api.updateTemplate(editing.id, { name: name.trim(), body });
      else await api.createTemplate({ name: name.trim(), body });
      setEditorOpen(false);
      await loadTemplates();
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function setDefault(template: OtpTemplate) {
    setError('');
    try {
      await api.updateTemplate(template.id, { name: template.name, body: template.body, is_default: true });
      await loadTemplates();
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  }

  async function deleteTemplate() {
    if (!pendingDelete) return;
    setError('');
    try {
      await api.deleteTemplate(pendingDelete.id);
      setPendingDelete(null);
      await loadTemplates();
    } catch (requestError) {
      setError(friendlyError(requestError));
    }
  }

  async function sendTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!testTemplate) return;
    setTesting(true);
    setError('');
    setTestResult(null);
    try {
      const result = await api.sendTemplateTest(testTemplate.id, testPhone);
      if ('status' in result && result.status === 'pending_link') setTestResult(result);
      else setTestTemplate(null);
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-heading">
        <div><span className="eyebrow"><i /> MESSAGE DESIGN</span><h1>Templates</h1><p>Write the Telegram message your users will see.</p></div>
        <button className="button button-primary" onClick={() => openEditor()} type="button">New template <span aria-hidden="true">+</span></button>
      </div>
      {error && <p className="dashboard-inline-error" role="alert">{error}</p>}
      {loading ? <div className="table-loading" role="status">Loading templates…</div> : templates.length ? (
        <div className="template-grid">
          {templates.map((template, index) => (
            <article className="dashboard-panel template-card" key={template.id}>
              <div className="template-card-heading">
                <span className={`template-icon template-icon-${index % 3}`} aria-hidden="true">{index % 2 ? 'Aa' : '✉'}</span>
                <div><h2>{template.name}</h2>{template.is_default && <Badge status="verified">default</Badge>}</div>
                <button aria-label={`Actions for ${template.name}`} className="icon-button" onClick={() => openEditor(template)} type="button">•••</button>
              </div>
              <div className="template-preview">
                <span className="template-preview-avatar">D</span>
                <div><small>Dart-OTP</small><p>{template.body.replace('{{code}}', '482913')}</p></div>
              </div>
              <div className="template-card-actions">
                {!template.is_default && <button className="text-button" onClick={() => setDefault(template)} type="button">Make default</button>}
                <button className="text-button" onClick={() => { setError(''); setTestTemplate(template); setTestResult(null); setTestPhone(''); }} type="button">Send test</button>
                <button className="text-button" onClick={() => openEditor(template)} type="button">Edit</button>
                {!template.is_default && <button className="text-button text-button-danger" onClick={() => setPendingDelete(template)} type="button">Delete</button>}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-panel empty-state"><div className="empty-art" aria-hidden="true"><span>Aa</span><i>✦</i></div><h3>No templates yet.</h3><p>Create a message that includes the <code>{'{{code}}'}</code> placeholder.</p><button className="button button-primary" onClick={() => openEditor()} type="button">Create a template</button></div>
      )}
      {editorOpen && (
        <Dialog title={editing ? 'Edit template' : 'New template'} description="Keep it clear and include the code placeholder." onClose={() => setEditorOpen(false)}>
          <form className="dialog-form" onSubmit={saveTemplate}>
            <label className="form-field" htmlFor="template-name"><span>Template name</span><Input autoFocus id="template-name" maxLength={60} onChange={(event) => setName(event.target.value)} value={name} /></label>
            <label className="form-field" htmlFor="template-body"><span>Message</span><Textarea id="template-body" maxLength={300} onChange={(event) => setBody(event.target.value)} rows={4} value={body} /></label>
            <div className="template-helper-row"><button className="text-button" onClick={() => setBody(`${body} {{code}}`)} type="button">Insert {'{{code}}'}</button><span>{body.length}/300 characters</span></div>
            <div className="telegram-preview"><span className="template-preview-avatar">D</span><div><small>Dart-OTP</small><p>{body.replace('{{code}}', '482913') || 'Your message preview appears here.'}</p></div></div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <StickerButton loading={saving} type="submit">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create template'}</StickerButton>
          </form>
        </Dialog>
      )}
      {testTemplate && (
        <Dialog title="Send a test" description="The test message uses the sandbox code 123456." onClose={() => { setTestTemplate(null); setTestResult(null); }}>
          <form className="dialog-form" onSubmit={sendTest}>
            <label className="form-field" htmlFor="test-phone"><span>Phone number</span><Input autoFocus id="test-phone" onChange={(event) => setTestPhone(event.target.value)} placeholder="+2348012345678" type="tel" value={testPhone} /></label>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <StickerButton loading={testing} type="submit">{testing ? 'Sending…' : 'Send test'}</StickerButton>
          </form>
          {testResult && <div className="pending-link-message"><p>This phone is not linked yet. Open this link in Telegram first.</p><a className="button button-violet" href={testResult.deep_link} rel="noreferrer" target="_blank">Open Telegram <span aria-hidden="true">↗</span></a><CopyButton value={testResult.deep_link} label="Copy link" /></div>}
        </Dialog>
      )}
      {pendingDelete && (
        <Dialog title="Delete this template?" description={`${pendingDelete.name} will be removed. This cannot be undone.`} onClose={() => setPendingDelete(null)}>
          <div className="dialog-actions"><button className="button button-ghost" onClick={() => setPendingDelete(null)} type="button">Keep template</button><button className="button button-danger" onClick={deleteTemplate} type="button">Delete template</button></div>
        </Dialog>
      )}
    </div>
  );
}
