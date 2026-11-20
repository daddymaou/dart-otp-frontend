import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page">
        <article className="page-shell legal-page">
          <span className="eyebrow"><i /> Legal</span>
          <h1>Terms of Service</h1>
          <p><strong>Last updated: 15 November 2026</strong></p>

          <h2>1. About these terms</h2>
          <p>These Terms of Service govern your access to and use of Dart-OTP, including its API, dashboard, and Telegram bot integration. Dart-OTP is operated by MaouKnowsJava (“Dart-OTP”, “we”, “us”, or “our”). By creating an account or using the service, you agree to these terms. If you use Dart-OTP for an organization, you confirm that you are authorized to accept these terms on its behalf.</p>

          <h2>2. The service</h2>
          <p>Dart-OTP provides tools for requesting, delivering, and verifying one-time passcodes through Telegram. The service includes test and live API keys, templates, logs, statistics, and webhooks, subject to the features and limits available to your account.</p>
          <p>Live delivery requires the recipient to have Telegram and, where requested, to link their phone number with the <a href="https://t.me/dartotp_bot" rel="noreferrer" target="_blank">@dartotp_bot</a>. Test keys use a fixed sandbox code and do not deliver messages to Telegram.</p>

          <h2>3. Accounts and credentials</h2>
          <p>You must provide accurate account information and keep your password, API keys, and webhook signing secrets confidential. API keys must be used only from systems you control and must not be embedded in public browser or mobile-app code. You are responsible for activity performed with your account and credentials. Revoke a key promptly if it may have been exposed, and contact us about suspected unauthorized access.</p>

          <h2>4. Your integration and end users</h2>
          <p>You are responsible for your application, how it uses verification results, and the notices and permissions required for your end users. You must have an appropriate legal basis to submit a person’s phone number and request a code for them. Do not send codes for accounts or actions the person did not request, or use the service to harass, deceive, or unlawfully profile anyone.</p>
          <p>Dart-OTP is a verification component, not a complete authentication or fraud-prevention system. Your application must independently enforce authorization, rate limits, session security, and other controls appropriate to your use case.</p>

          <h2>5. Plans, limits, and payment</h2>
          <p>Monthly plan limits apply to live OTP sends. Test sends do not count toward the live-send allowance. The current published plans are:</p>
          <ul>
            <li>Free: 100 live sends per month at ₦0.</li>
            <li>Starter: 1,000 live sends per month at ₦2,500 per month.</li>
            <li>Growth: 5,000 live sends per month at ₦7,500 per month.</li>
            <li>Pro: 10,000 live sends per month at ₦15,000 per month.</li>
            <li>Business: 50,000 live sends per month at ₦50,000 per month.</li>
          </ul>
          <p>Paid plans are requested through support and require confirmation before activation. There is no online checkout in the dashboard. Applicable taxes, payment arrangements, and the start of a paid plan will be confirmed with you before activation. Requests may be limited by service availability.</p>
          <p>Rate limits, resend cooldowns, OTP expiry, and plan quotas are enforced by the API. We may reject or delay requests that exceed the limits returned by the service.</p>

          <h2>6. Acceptable use</h2>
          <p>You must comply with applicable law and Telegram’s terms. You may not misuse the service, interfere with its operation, attempt unauthorized access, bypass limits, submit malicious content, or use it to deliver unsolicited or unlawful messages. We may investigate suspected abuse and take proportionate action to protect users and the service.</p>

          <h2>7. Third-party services and availability</h2>
          <p>Dart-OTP depends on third-party services, including Render for hosting and Telegram for message delivery. We do not control those providers and cannot guarantee their uninterrupted availability, delivery timing, or continued operation. Telegram delivery may fail if a recipient has not linked their account, blocks the bot, or cannot receive Telegram messages.</p>
          <p>We may maintain, update, suspend, or change parts of the service. We will make reasonable efforts to preserve service and data, but do not promise uninterrupted or error-free operation.</p>

          <h2>8. Suspension and termination</h2>
          <p>We may restrict or suspend access if reasonably necessary to address a security risk, suspected unlawful use, serious breach of these terms, or harm to the service or others. Where practical, we will notify you and explain the issue. You may stop using the service and delete your account from dashboard settings. Account deletion removes associated account data from the active service database, subject to technical backups and any retention required by law.</p>

          <h2>9. Intellectual property</h2>
          <p>Dart-OTP and its branding, software, and documentation are owned by or licensed to the operator. These terms give you permission to use the service for its intended purpose; they do not transfer ownership or grant rights to copy, resell, or redistribute the software.</p>

          <h2>10. Disclaimers and liability</h2>
          <p>The service is provided on an “as available” basis. To the extent permitted by applicable law, we do not warrant that every code will be delivered, that the service will meet every integration requirement, or that use of OTPs alone will prevent unauthorized access.</p>
          <p>To the extent permitted by applicable law, neither party is liable to the other for indirect or consequential loss arising from use of the service. Nothing in these terms excludes liability that cannot legally be excluded, including liability for fraud or willful misconduct where applicable.</p>

          <h2>11. Changes and governing law</h2>
          <p>We may update these terms as the service changes. The updated version will be posted here with a revised date. Continued use after an update means you accept the revised terms, to the extent permitted by law.</p>
          <p>These terms are governed by the laws of the Federal Republic of Nigeria. The courts of Nigeria will have jurisdiction, subject to any mandatory rights or dispute-resolution requirements under applicable law.</p>

          <h2>12. Contact</h2>
          <p>For questions about these terms or the service, email <a href="mailto:maou4rl@gmail.com">maou4rl@gmail.com</a>. See the <Link href="/privacy">Privacy Notice</Link> for information about personal data.</p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
