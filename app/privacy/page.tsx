import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main className="simple-page">
        <article className="page-shell legal-page">
          <span className="eyebrow"><i /> Legal</span>
          <h1>Privacy notice</h1>
          <p className="legal-placeholder">Draft placeholder — replace this text with a reviewed privacy notice before launch.</p>
          <h2>Information used to provide the service</h2>
          <p>Dart-OTP processes account details, phone numbers submitted for OTP delivery, and delivery or verification events to operate the service.</p>
          <h2>One-time passcodes</h2>
          <p>OTP codes are stored as salted verification hashes rather than readable code values. A code is time-limited and should never be shared with anyone.</p>
          <h2>Retention and questions</h2>
          <p>Retention periods and data-subject request details must be confirmed by the service owner before launch. Send privacy questions to <a href="mailto:privacy@dart-otp.dev">privacy@dart-otp.dev</a>.</p>
          <p><Link href="/terms">Read the terms of service</Link></p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
