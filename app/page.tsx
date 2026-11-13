import Image from 'next/image';
import Link from 'next/link';
import { CodeExamples, SiteFooter, SiteNav, WaveDivider } from '@/components/site';
import { plans } from '@/lib/plans';

const steps = [
  {
    number: '01',
    title: 'Call the API',
    description: 'Send a phone number and your API key. That is the whole first step.',
    art: '⌘',
    color: 'sky',
  },
  {
    number: '02',
    title: 'Telegram delivers',
    description: 'A linked user gets a one-time code in the Dart-OTP Telegram bot.',
    art: '✉',
    color: 'pink',
  },
  {
    number: '03',
    title: 'Verify and move on',
    description: 'Send the code back to the API and get a clear verification result.',
    art: '✓',
    color: 'mint',
  },
];

const features = [
  { title: 'Templates', description: 'Shape the message to fit your product, with the code right where it belongs.', icon: 'Aa', color: 'yellow' },
  { title: 'Webhooks', description: 'Send delivery events to the systems you already use.', icon: '↗', color: 'pink' },
  { title: 'Test keys', description: 'Try the integration in a sandbox without sending Telegram messages.', icon: '⌘', color: 'sky' },
  { title: 'Logs and stats', description: 'See what was sent, verified, or left unfinished.', icon: '▥', color: 'mint' },
];

const questions = [
  {
    question: 'Does a user need Telegram?',
    answer: 'Yes. The person receiving a code needs an active Telegram account to get it through the Dart-OTP bot.',
  },
  {
    question: 'Does the user need to link their phone first?',
    answer: 'Yes. Before the first code, the user opens a one-time Telegram link so the bot can connect their phone number.',
  },
  {
    question: 'Are OTP codes stored?',
    answer: 'The service stores a salted hash for verification, not the readable code. Codes expire after a few minutes.',
  },
  {
    question: 'How long are records kept?',
    answer: 'Delivery and verification records are available in your dashboard. Exact retention depends on the service policy and will be documented before launch.',
  },
  {
    question: 'Are there rate limits?',
    answer: 'Yes. The API applies request limits and a resend cooldown. The response includes a useful error when you need to wait.',
  },
  {
    question: 'Can I try it without messaging a real user?',
    answer: 'Yes. Create a test key to exercise the API flow in its sandbox; test sends do not contact Telegram.',
  },
];

function Sticker({ file, className = '' }: { file: string; className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`sticker ${className}`}
      height={68}
      src={`/assets/stickers/${file}.svg`}
      width={68}
    />
  );
}

function FallbackArt({ type }: { type: string }) {
  return (
    <div className={`fallback-art fallback-art-${type}`} aria-hidden="true">
      <div className="art-blob">
        <div className="art-window">
          <div className="art-window-top"><i /><i /><i /></div>
          <div className="art-lines"><i /><i /><i /></div>
          <div className="art-code">482913</div>
        </div>
      </div>
      <span className="art-spark art-spark-one">✦</span>
      <span className="art-spark art-spark-two">✳</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNav />
      <main id="main-content">
        <section className="hero-section" id="product">
          <div className="pattern-layer pattern-white" aria-hidden="true" />
          <div className="hero-inner page-shell">
            <div className="hero-copy">
              <span className="eyebrow eyebrow-on-dark"><i /> OTP delivery, minus SMS</span>
              <h1>Send codes where your users already are.</h1>
              <p className="hero-description">
                Dart-OTP delivers one-time passcodes through Telegram. One API call to send,
                one to verify. No SMS bills.
              </p>
              <div className="hero-actions">
                <Link className="button button-primary button-large" href="/signup">Get your API key <span aria-hidden="true">↗</span></Link>
                <a className="button button-ghost button-large" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
              </div>
              <p className="hero-note">Free to start. No card needed.</p>
            </div>
            <div className="hero-visual">
              <Sticker className="hero-sticker hero-sticker-bolt" file="sticker-bolt-yellow" />
              <Sticker className="hero-sticker hero-sticker-star" file="sticker-star-pink" />
              <Sticker className="hero-sticker hero-sticker-bubble" file="sticker-bubble-paper" />
              <FallbackArt type="hero" />
              <div className="hero-chat-sticker">
                <div className="chat-heading"><span className="bot-avatar">D</span><span><b>Dart-OTP</b><small>bot</small></span><i>•••</i></div>
                <div className="chat-message">Your verification code is <strong>482 913</strong><small>Never share this code with anyone.</small></div>
                <span className="chat-time">now <b>✓✓</b></span>
              </div>
              <div className="hero-api-chip"><span className="status-dot" /> API ready <b>200 OK</b></div>
            </div>
          </div>
          <div className="hero-ribbon" aria-hidden="true">
            <img src="/assets/waves/ribbons/ribbon-yellow-sky-lilac.svg" alt="" />
          </div>
        </section>

        <section className="intro-section">
          <div className="pattern-layer pattern-ink" aria-hidden="true" />
          <div className="page-shell intro-inner">
            <span className="eyebrow"><i /> The easier route to a code</span>
            <h2>Your users already live in Telegram. <span>Meet them there.</span></h2>
            <div className="intro-columns">
              <article>
                <span className="section-index">01 / WHY TELEGRAM</span>
                <h3>A familiar place, not another inbox.</h3>
                <p>People already check Telegram. Send a one-time code where they are, instead of asking them to switch apps or wait for an SMS.</p>
              </article>
              <article>
                <span className="section-index">02 / WHAT YOU GET</span>
                <h3>A small API with a clear job.</h3>
                <p>Send an OTP, verify the reply, and see what happened in your dashboard. No elaborate setup to get the first request moving.</p>
              </article>
            </div>
            <Sticker className="intro-sticker" file="sticker-squiggle-violet" />
          </div>
        </section>

        <section className="steps-section" id="how-it-works">
          <WaveDivider shape="c" color="paper" height={86} />
          <div className="page-shell section-content">
            <div className="section-heading centered-heading">
              <span className="eyebrow"><i /> Three steps, one tiny API</span>
              <h2>From request to verified.</h2>
              <p>Keep your app in charge. We handle the Telegram handoff.</p>
            </div>
            <div className="steps-grid">
              {steps.map((step) => (
                <article className="sticker-card step-card" key={step.number}>
                  <span className="step-number">{step.number}</span>
                  <div className={`step-art sticker-tone-${step.color}`}>
                    <span>{step.art}</span>
                    <div className="step-art-orbit" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <div className="demo-strip">
              <div className="demo-copy">
                <span className="eyebrow"><i /> A quick look</span>
                <h3>One request in. One code out.</h3>
                <p>A linked user gets their code in the bot. Test keys return the sandbox code without sending a message.</p>
              </div>
              <div className="demo-screen" aria-label="Example OTP delivery">
                <div className="demo-terminal">
                  <div className="demo-terminal-title"><span /> send a code</div>
                  <code><b>$</b> POST /v1/otp/send</code>
                  <code className="demo-terminal-result">status: <strong>sent</strong></code>
                </div>
                <div className="demo-telegram">
                  <span className="bot-avatar">D</span>
                  <div><small>Dart-OTP</small><strong>482913</strong></div>
                  <span className="verified-stamp">✓ verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <WaveDivider shape="b" color="deep" height={90} />
          <div className="pattern-layer pattern-white" aria-hidden="true" />
          <div className="page-shell features-inner section-content">
            <div className="features-art">
              <FallbackArt type="features" />
              <Sticker className="features-sticker" file="sticker-plane-pink" />
              <div className="features-art-label"><span>YOUR APP</span><b>↔</b><span>TELEGRAM</span></div>
            </div>
            <div className="features-copy">
              <span className="eyebrow eyebrow-on-dark"><i /> A few useful extras</span>
              <h2>The essentials, already in the box.</h2>
              <div className="feature-grid">
                {features.map((feature) => (
                  <article className="feature-tile" key={feature.title}>
                    <span className={`feature-icon sticker-tone-${feature.color}`} aria-hidden="true">{feature.icon}</span>
                    <div><h3>{feature.title}</h3><p>{feature.description}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="developer-section">
          <div className="page-shell developer-inner">
            <div className="section-heading developer-heading">
              <span className="eyebrow"><i /> Made for the request/response crowd</span>
              <h2>Keep the integration boring.</h2>
              <p>Use your favorite language. Keep API keys on your server, never in the browser.</p>
            </div>
            <CodeExamples />
            <p className="developer-footnote">The API returns <code>pending_link</code> if a phone has not been linked to the bot yet.</p>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <WaveDivider shape="a" color="lilac" height={82} />
          <div className="page-shell section-content">
            <div className="section-heading centered-heading">
              <span className="eyebrow"><i /> Straightforward starting points</span>
              <h2>Start small. Grow when you need to.</h2>
              <p>Pricing figures are placeholders for now, not a checkout promise.</p>
            </div>
            <div className="pricing-grid">
              {plans.map((plan, index) => (
                <article className={`sticker-card pricing-card ${index === 1 ? 'pricing-card-featured' : ''}`} key={plan.id}>
                  {index === 1 && <span className="pricing-ribbon">MORE ROOM</span>}
                  <div className="pricing-card-top"><span className="plan-badge">{plan.name}</span><span className="pricing-price">{plan.price}</span></div>
                  <p>{plan.description}</p>
                  <div className="plan-quota"><strong>{plan.monthlySends.toLocaleString()}</strong><span>sends / month</span></div>
                  <ul>{plan.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
                  <Link className={`button ${index === 1 ? 'button-violet' : 'button-primary'} button-full`} href="/signup">
                    Get started <span aria-hidden="true">↗</span>
                  </Link>
                </article>
              ))}
            </div>
            <p className="pricing-note">Telegram is required for delivery. A phone has to be linked to the bot before its first code.</p>
          </div>
        </section>

        <section className="faq-section" id="faq">
          <div className="page-shell faq-inner">
            <div className="faq-heading">
              <span className="eyebrow"><i /> Good to know</span>
              <h2>Before you send that first code.</h2>
              <p>No surprises about how Telegram delivery works.</p>
            </div>
            <div className="faq-list">
              {questions.map((item, index) => (
                <details className="faq-item" key={item.question} open={index === 0}>
                  <summary><span>{item.question}</span><i aria-hidden="true" /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="pattern-layer pattern-ink" aria-hidden="true" />
          <div className="page-shell final-cta-inner">
            <Sticker className="cta-sticker cta-sticker-one" file="sticker-burst-violet" />
            <Sticker className="cta-sticker cta-sticker-two" file="sticker-star-yellow" />
            <span className="eyebrow"><i /> Your first code is a few requests away</span>
            <h2>Ready to ditch SMS?</h2>
            <p>Grab a key and send your first code.</p>
            <Link className="button button-primary button-large" href="/signup">Get your API key <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
