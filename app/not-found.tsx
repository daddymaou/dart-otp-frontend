import Link from 'next/link';
import { SiteFooter, SiteNav } from '@/components/site';

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="system-page">
        <div className="system-art" aria-hidden="true"><span>404</span><i>?</i></div>
        <span className="eyebrow"><i /> Wrong turn</span>
        <h1>This page wandered off.</h1>
        <p>That address does not point to a page we can find.</p>
        <Link className="button button-primary" href="/">Back to the home page <span aria-hidden="true">↗</span></Link>
      </main>
      <SiteFooter />
    </>
  );
}
