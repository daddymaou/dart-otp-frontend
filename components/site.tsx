'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

const navigation = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const extraLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'Status', href: 'mailto:status@dart-otp.dev' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState('Product');
  const [authenticated, setAuthenticated] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const previousScroll = useRef(0);
  const menuPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    api.me()
      .then(() => { if (isMounted) setAuthenticated(true); })
      .catch(() => { if (isMounted) setAuthenticated(false); });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setCompact(current > 80);
      setHidden(!menuOpen && current > 160 && current > previousScroll.current + 4);
      if (current < 80) setHidden(false);
      previousScroll.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () =>
      menuPanel.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
    focusable()?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKeyDown);
      menuButton.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-nav-wrap ${hidden ? 'site-nav-wrap-hidden' : ''}`}>
        <nav className={`site-nav ${compact ? 'site-nav-compact' : ''}`} aria-label="Main navigation">
          <Link className="brand-lockup" href="/" aria-label="Dart-OTP home">
            <Image
              className="brand-logo"
              src="/assets/brand/logo-512.png"
              alt=""
              width={44}
              height={44}
              priority
            />
            <span>Dart-OTP</span>
          </Link>
          <div className="site-nav-links">
            {navigation.map((item) => (
              <a
                className={`nav-link ${active === item.label ? 'nav-link-active' : ''}`}
                href={item.href}
                key={item.label}
                onClick={() => setActive(item.label)}
                onFocus={() => setActive(item.label)}
                onMouseEnter={() => setActive(item.label)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="site-nav-actions">
            {!authenticated && <Link className="nav-login" href="/login">Log in</Link>}
            <Link className="button button-primary nav-cta" href={authenticated ? '/dashboard' : '/signup'}>
              {authenticated ? 'Go to dashboard' : 'Get API key'}
            </Link>
            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              ref={menuButton}
              type="button"
            >
              <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
              <span>Menu</span>
            </button>
          </div>
        </nav>
      </header>
      {menuOpen && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="menu-overlay-shape" aria-hidden="true" />
          <div className="menu-panel" ref={menuPanel}>
            <div className="menu-top">
              <Link className="menu-brand" href="/" onClick={() => setMenuOpen(false)}>
                <span className="logo-chip"><Image src="/assets/brand/logo-512.png" alt="" width={38} height={38} /></span>
                <span>Dart-OTP</span>
              </Link>
              <button
                aria-label="Close menu"
                className="menu-close"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="menu-main-links">
              {navigation.map((item, index) => (
                <a
                  href={item.href}
                  key={item.label}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="menu-bottom-links">
              {extraLinks.map((item) => (
                <Link href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href={authenticated ? '/dashboard' : '/signup'} onClick={() => setMenuOpen(false)}>
                {authenticated ? 'Go to dashboard' : 'Get an API key'}
              </Link>
            </div>
            <Image className="menu-sticker menu-sticker-one" src="/assets/stickers/sticker-bolt-yellow.svg" alt="" width={72} height={72} />
            <Image className="menu-sticker menu-sticker-two" src="/assets/stickers/sticker-star-pink.svg" alt="" width={62} height={62} />
            <Image className="menu-sticker menu-sticker-three" src="/assets/stickers/sticker-bubble-paper.svg" alt="" width={74} height={74} />
          </div>
        </div>
      )}
    </>
  );
}

export function WaveDivider({
  shape = 'a',
  color = 'paper',
  edge = false,
  flip = false,
  height = 88,
}: {
  shape?: 'a' | 'b' | 'c' | 'd';
  color?: 'deep' | 'lilac' | 'mint' | 'paper' | 'pink' | 'sky' | 'violet' | 'yellow';
  edge?: boolean;
  flip?: boolean;
  height?: number;
}) {
  const folder = edge ? 'ink-edge' : 'plain';
  const suffix = edge ? '-edge' : '';
  return (
    <div
      aria-hidden="true"
      className={`wave-divider ${flip ? 'wave-divider-flip' : ''}`}
      style={{ height }}
    >
      <img src={`/assets/waves/${folder}/wave-${shape}-${color}${suffix}.svg`} alt="" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <WaveDivider shape="c" color="deep" height={74} />
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo-chip"><Image src="/assets/brand/logo-512.png" alt="" width={48} height={48} /></span>
          <div>
            <strong>Dart-OTP</strong>
            <p>One-time codes, minus the SMS bill.</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/docs">Docs</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:hello@dart-otp.dev">Contact</a>
          <a href="mailto:status@dart-otp.dev">Status</a>
        </nav>
      </div>
    </footer>
  );
}

export function CopyButton({ value, label = 'Copy', onCopied }: { value: string; label?: string; onCopied?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [copyUnavailable, setCopyUnavailable] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copy() {
    if (!navigator.clipboard) {
      setCopyUnavailable(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setCopyUnavailable(false);
      onCopied?.();
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyUnavailable(true);
    }
  }

  return (
    <button className="copy-button" onClick={copy} type="button" aria-live="polite" title={copyUnavailable ? 'Clipboard access is unavailable in this browser context.' : undefined}>
      <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
      {copied ? 'Copied' : copyUnavailable ? 'Copy unavailable' : label}
    </button>
  );
}

const snippets = {
  curl: `curl -X POST "$API_URL/v1/otp/send" \\
  -H "X-API-Key: $DART_OTP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone":"+2348012345678"}'`,
  JavaScript: `const response = await fetch(\`\${API_URL}/v1/otp/send\`, {
  method: 'POST',
  headers: {
    'X-API-Key': process.env.DART_OTP_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ phone: '+2348012345678' }),
});

const result = await response.json();`,
  Python: `response = requests.post(
    f"{API_URL}/v1/otp/send",
    headers={"X-API-Key": os.environ["DART_OTP_API_KEY"]},
    json={"phone": "+2348012345678"},
)
result = response.json()`,
  Go: `requestBody := strings.NewReader(
    \`{"phone":"+2348012345678"}\`,
)
req, _ := http.NewRequest("POST", apiURL+"/v1/otp/send", requestBody)
req.Header.Set("X-API-Key", os.Getenv("DART_OTP_API_KEY"))
req.Header.Set("Content-Type", "application/json")
response, err := http.DefaultClient.Do(req)`,
};

type SnippetLanguage = keyof typeof snippets;

export function CodeExamples() {
  const [language, setLanguage] = useState<SnippetLanguage>('curl');
  const code = snippets[language];
  return (
    <div className="code-window">
      <div className="code-window-bar">
        <div className="code-dots" aria-hidden="true"><i /><i /><i /></div>
        <div className="code-tabs" role="tablist" aria-label="Code example language">
          {(Object.keys(snippets) as SnippetLanguage[]).map((item) => (
            <button
              aria-selected={language === item}
              className={language === item ? 'code-tab code-tab-active' : 'code-tab'}
              key={item}
              onClick={() => setLanguage(item)}
              role="tab"
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <CopyButton value={code} label="Copy" />
      </div>
      <pre className="code-content"><code>{code}</code></pre>
    </div>
  );
}
