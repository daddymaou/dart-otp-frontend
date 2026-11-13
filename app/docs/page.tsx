import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function DocsPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page">
        <div className="page-shell simple-page-inner">
          <span className="eyebrow"><i /> Developer docs</span>
          <h1>Docs are on their way.</h1>
          <p>For now, here is the quickest path to sending an OTP. Keep your API key on your server.</p>
          <div className="simple-code">
            <pre><code>{`curl -X POST "$API_URL/v1/otp/send" \\
  -H "X-API-Key: $DART_OTP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+2348012345678"}'`}</code></pre>
          </div>
          <p className="simple-note">A user who has not linked their phone receives a <code>pending_link</code> response with a Telegram deep link.</p>
          <Link className="button button-primary" href="/signup">Create an API key <span aria-hidden="true">↗</span></Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
