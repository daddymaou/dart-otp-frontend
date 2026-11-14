import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

const sendExample = `curl -X POST "$API_BASE_URL/v1/otp/send" \\
  -H "X-API-Key: $DART_OTP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+2348012345678"}'`;

const verifyExample = `curl -X POST "$API_BASE_URL/v1/otp/verify" \\
  -H "X-API-Key: $DART_OTP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+2348012345678","code":"123456"}'`;

const resendExample = `curl -X POST "$API_BASE_URL/v1/otp/resend" \\
  -H "X-API-Key: $DART_OTP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+2348012345678"}'`;

const errors = [
  ['invalid_request', '400', 'Malformed JSON or a required field is missing.'],
  ['invalid_phone', '422', 'The phone number is not valid international E.164 format.'],
  ['unauthorized', '401', 'The API key is missing, invalid, or revoked.'],
  ['account_suspended', '403', 'The workspace is suspended.'],
  ['not_found', '404', 'The requested resource was not found.'],
  ['conflict', '409', 'The operation conflicts with existing data.'],
  ['cooldown_active', '429', 'A resend was requested too soon; check retry_after.'],
  ['rate_limited', '429', 'The request limit was reached; wait before retrying.'],
  ['quota_exceeded', '429', 'The monthly live-send quota was reached.'],
  ['telegram_blocked', '422', 'The recipient has blocked the Telegram bot.'],
  ['delivery_failed', '502', 'Telegram delivery failed.'],
  ['internal', '500', 'The service encountered an unexpected error.'],
];

export default function DocsPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page docs-page">
        <div className="docs-shell">
          <header className="docs-header">
            <span className="eyebrow"><i /> Developer docs</span>
            <h1>Ship phone verification without SMS.</h1>
            <p>Use the Dart-OTP API to send a one-time code through Telegram, then verify it from your server.</p>
            <div className="docs-callout">
              <strong>Keep your API key secret.</strong>
              <span>Make these requests from your backend. Never expose a Dart-OTP key in browser code or a mobile app.</span>
            </div>
          </header>

          <div className="docs-layout">
            <nav className="docs-toc" aria-label="On this page">
              <strong>On this page</strong>
              <a href="#quickstart">Quickstart</a>
              <a href="#test-mode">Test mode</a>
              <a href="#send">Send a code</a>
              <a href="#verify">Verify a code</a>
              <a href="#resend">Resend a code</a>
              <a href="#responses">Responses and errors</a>
              <a href="#dashboard-api">Dashboard API</a>
            </nav>

            <div className="docs-content">
              <section className="docs-section" id="quickstart">
                <span className="docs-step">01 / QUICKSTART</span>
                <h2>Make your first test request</h2>
                <ol>
                  <li><Link href="/signup">Create an account</Link> and open <Link href="/dashboard/keys">API keys</Link>.</li>
                  <li>Create a <strong>test</strong> key and store it in a server-side environment variable.</li>
                  <li>Set <code>API_BASE_URL</code> to the backend’s base URL and send a test OTP.</li>
                  <li>Verify it with the fixed test code <code>123456</code>.</li>
                </ol>
                <div className="docs-code-note">
                  <strong>Base URL</strong>
                  <p>Use the HTTPS base URL for your Dart-OTP backend, without a trailing slash. The Vercel frontend URL is not the backend URL.</p>
                </div>
              </section>

              <section className="docs-section" id="test-mode">
                <span className="docs-step">02 / SANDBOX</span>
                <h2>Test keys do not message users</h2>
                <p>A test key starts with <code>dart_test_</code>. Test requests do not send a Telegram message, do not require the recipient to link Telegram, and do not count toward the monthly live-send quota. The test OTP is always <code>123456</code>.</p>
                <p>Use your actual phone number in E.164 format, such as <code>+2348012345678</code>. A successful test send returns <code>status: &quot;sent&quot;</code>.</p>
              </section>

              <section className="docs-section" id="send">
                <span className="docs-step">03 / SEND</span>
                <h2>Request a one-time code</h2>
                <p><code>POST /v1/otp/send</code></p>
                <pre className="docs-code"><code>{sendExample}</code></pre>
                <p>Required header: <code>X-API-Key</code>. The phone number must be a valid E.164 number. You can optionally include a tenant-owned <code>template_id</code>.</p>
                <h3>Delivered response</h3>
                <pre className="docs-code docs-code-light"><code>{`{
  "otp_id": "uuid",
  "status": "sent",
  "expires_at": "2026-11-12T10:05:00Z"
}`}</code></pre>
                <h3>Recipient needs to link Telegram</h3>
                <pre className="docs-code docs-code-light"><code>{`{
  "otp_id": "uuid",
  "status": "pending_link",
  "deep_link": "https://t.me/DartOTPBot?start=<token>",
  "link_expires_at": "2026-11-12T10:15:00Z"
}`}</code></pre>
                <p>For a live key, send the deep link to the user and have them open it and share their own phone number with the bot. Then request a new code.</p>
              </section>

              <section className="docs-section" id="verify">
                <span className="docs-step">04 / VERIFY</span>
                <h2>Verify the code</h2>
                <p><code>POST /v1/otp/verify</code></p>
                <pre className="docs-code"><code>{verifyExample}</code></pre>
                <p>Verification outcomes use HTTP 200. Check the returned status before continuing your own sign-in or transaction.</p>
                <pre className="docs-code docs-code-light"><code>{`{ "status": "verified" }`}</code></pre>
                <p>Possible statuses: <code>verified</code>, <code>invalid</code>, <code>expired</code>, <code>too_many_attempts</code>, and <code>not_found</code>. A code can only be used once.</p>
              </section>

              <section className="docs-section" id="resend">
                <span className="docs-step">05 / RESEND</span>
                <h2>Resend after the cooldown</h2>
                <p><code>POST /v1/otp/resend</code> accepts the same phone and optional template fields as send.</p>
                <pre className="docs-code"><code>{resendExample}</code></pre>
                <p>Resends are subject to a per-phone cooldown. A <code>cooldown_active</code> error includes <code>retry_after</code> seconds; wait that long before retrying.</p>
              </section>

              <section className="docs-section" id="responses">
                <span className="docs-step">06 / REFERENCE</span>
                <h2>Errors and request limits</h2>
                <p>Errors use a consistent JSON shape:</p>
                <pre className="docs-code docs-code-light"><code>{`{
  "error": {
    "code": "invalid_phone",
    "message": "Phone must be a valid number in international format."
  }
}`}</code></pre>
                <div className="docs-table-wrap">
                  <table className="docs-table">
                    <thead><tr><th>Code</th><th>HTTP</th><th>Meaning</th></tr></thead>
                    <tbody>{errors.map(([code, status, meaning]) => (
                      <tr key={code}><td><code>{code}</code></td><td>{status}</td><td>{meaning}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
                <p>Live sends are subject to per-tenant rate limits, resend cooldowns, and monthly quotas. Test sends bypass Telegram delivery and monthly live-send quota.</p>
              </section>

              <section className="docs-section" id="dashboard-api">
                <span className="docs-step">07 / WORKSPACE</span>
                <h2>Dashboard API</h2>
                <p>The web dashboard uses an HTTP-only session cookie. These routes are for workspace integrations; they are not authenticated with an API key.</p>
                <div className="docs-table-wrap">
                  <table className="docs-table">
                    <thead><tr><th>Routes</th><th>Purpose</th></tr></thead>
                    <tbody>
                      <tr><td><code>POST /v1/auth/signup</code><br /><code>POST /v1/auth/login</code><br /><code>POST /v1/auth/logout</code><br /><code>GET /v1/auth/me</code><br /><code>DELETE /v1/auth/me</code></td><td>Account and session management. Account deletion requires the account password.</td></tr>
                      <tr><td><code>/v1/api-keys</code></td><td>Create, list, and revoke workspace keys. The full key is returned only once.</td></tr>
                      <tr><td><code>/v1/templates</code></td><td>Create and manage Telegram OTP message templates.</td></tr>
                      <tr><td><code>GET /v1/logs</code><br /><code>GET /v1/stats</code></td><td>Review paginated OTP activity and recent workspace usage.</td></tr>
                      <tr><td><code>/v1/webhooks</code></td><td>Configure event endpoints and review delivery attempts.</td></tr>
                      <tr><td><code>GET /health</code></td><td>Check API and database health; does not require authentication.</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>See <Link href="/dashboard/keys">API keys</Link> to create or revoke credentials. Treat webhook signing secrets like passwords and save them when first shown.</p>
              </section>

              <div className="docs-end">
                <h2>Ready to try it?</h2>
                <p>Create a test key, send a sandbox OTP, and check the result in your <Link href="/dashboard/logs">dashboard logs</Link>.</p>
                <Link className="button button-primary" href="/dashboard/keys">Open API keys <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
