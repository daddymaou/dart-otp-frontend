'use client';

import { useEffect } from 'react';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {}, []);
  return (
    <main className="system-page">
      <div className="system-art system-art-error" aria-hidden="true"><span>!</span><i>↻</i></div>
      <span className="eyebrow"><i /> A little hiccup</span>
      <h1>That did not go to plan.</h1>
      <p>Try again. Your account data has not been changed by this screen.</p>
      <button className="button button-primary" onClick={reset} type="button">Try again <span aria-hidden="true">↻</span></button>
    </main>
  );
}
