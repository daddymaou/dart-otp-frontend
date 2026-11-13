import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page">
        <article className="page-shell legal-page">
          <span className="eyebrow"><i /> Legal</span>
          <h1>Terms of service</h1>
          <p className="legal-placeholder">Draft placeholder — replace this text with reviewed terms before launch.</p>
          <h2>Using Dart-OTP</h2>
          <p>Dart-OTP provides tools for delivering one-time passcodes through Telegram. You are responsible for your integration, API key security, and using the service in accordance with applicable law.</p>
          <h2>Service limits</h2>
          <p>Access, quotas, rate limits, delivery behavior, and retention may change as the service develops. Current limits are shown in your account and API responses.</p>
          <h2>Account and contact</h2>
          <p>Keep your account details accurate and contact <a href="mailto:hello@dart-otp.dev">hello@dart-otp.dev</a> with service questions.</p>
          <p><Link href="/privacy">Read the privacy notice</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
