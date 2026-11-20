import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page">
        <article className="page-shell legal-page">
          <span className="eyebrow"><i /> Legal</span>
          <h1>Privacy Notice</h1>
          <p><strong>Last updated: 15 November 2026</strong></p>

          <h2>1. Who operates Dart-OTP</h2>
          <p>Dart-OTP is operated by MaouKnowsJava (“Dart-OTP”, “we”, “us”, or “our”). This notice explains how we handle personal data when you use our API, dashboard, or Telegram bot integration. For privacy questions or requests, email <a href="mailto:maou4rl@gmail.com">maou4rl@gmail.com</a>.</p>

          <h2>2. Data we process and our roles</h2>
          <p>For account and workspace information, we determine how it is used to operate your account. When a customer submits an end user’s phone number for an OTP request, the customer determines why that verification is needed; Dart-OTP processes the submitted information to provide the requested delivery and verification service.</p>
          <ul>
            <li><strong>Account data:</strong> name, email address, account plan, and a securely hashed password.</li>
            <li><strong>OTP data:</strong> phone number submitted for a verification request, an OTP verification hash and salt, expiry time, attempt count, and delivery or verification status.</li>
            <li><strong>Workspace data:</strong> API key display prefix and usage metadata, message templates, webhook URL and event settings, and webhook delivery status. Full API keys are shown only at creation; webhook signing secrets are also shown only at creation.</li>
            <li><strong>Technical data:</strong> request time, endpoint, response status, request identifier, and rate-limit events needed to operate, secure, and troubleshoot the service. We do not intentionally log passwords, cookies, API keys, webhook signing secrets, or plaintext OTP codes.</li>
          </ul>

          <h2>3. How we use data</h2>
          <p>We use this information to create and secure accounts, authenticate API requests, deliver and verify requested OTPs, operate templates and webhooks, enforce rate limits and plan quotas, maintain the service, investigate abuse, and respond to support or privacy requests. Depending on the context, processing is necessary to provide the service you request, protect the service and its users, comply with legal obligations, or act on instructions from a customer integrating the API.</p>
          <p>OTP codes are stored as salted verification hashes rather than readable code values. To deliver a live code, the service sends the recipient’s phone number and the code to Telegram through the Dart-OTP bot. Telegram processes that information under its own policies. Test-key requests do not send a Telegram message.</p>

          <h2>4. Cookies and service providers</h2>
          <p>The dashboard uses an HTTP-only session cookie to keep your account signed in. It is necessary for the authenticated dashboard and is not used by this application for advertising. The API and production database are hosted on Render. Telegram is used to deliver live OTP messages and complete phone-linking flows. These providers process information as needed to provide their services and are subject to their own terms and privacy notices. Data may be processed in locations where those providers operate.</p>

          <h2>5. Retention</h2>
          <p>OTP records are automatically deleted according to the service retention setting, which defaults to 30 days and may be configured by the operator. Rate-limit records are routinely cleaned up. Account information and associated workspace data remain in the active service database until the account is deleted, subject to technical backups, security records, and any retention required by law. Backup deletion follows the provider’s backup lifecycle.</p>

          <h2>6. Security</h2>
          <p>We use measures intended to protect information, including password hashing, hashed API keys, hashed OTP verification values, access controls, and tenant-scoped data access. No internet service can guarantee absolute security. You are responsible for protecting your account password, API keys, and webhook secrets.</p>

          <h2>7. Your choices and requests</h2>
          <p>You may access and delete your account through the dashboard. Account deletion requires password confirmation and removes associated account data from the active service database. Subject to applicable law, you may request access to or correction/deletion of your personal data, object to or request restriction of certain processing, and exercise other rights available to you. Where processing is based on consent, you may withdraw that consent. We may need to verify your identity before responding. If you have an unresolved concern, you may contact the Nigeria Data Protection Commission or another competent supervisory authority.</p>

          <h2>8. Children</h2>
          <p>Dart-OTP is a developer service and is not designed for children to create accounts. Customers are responsible for ensuring that their own use of verification data complies with applicable age and consent requirements.</p>

          <h2>9. Changes to this notice</h2>
          <p>We may update this notice as the service or applicable requirements change. The latest version and its effective date will be posted on this page.</p>

          <h2>10. Contact</h2>
          <p>For privacy questions or data requests, email <a href="mailto:maou4rl@gmail.com">maou4rl@gmail.com</a>. See the <Link href="/terms">Terms of Service</Link> for the terms governing use of Dart-OTP.</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
