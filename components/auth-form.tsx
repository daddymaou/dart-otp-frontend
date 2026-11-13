'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { api, friendlyError } from '@/lib/api';
import { StickerButton } from '@/components/ui';

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const isSignup = mode === 'signup';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (isSignup && values.name.trim().length < 2) {
      setError('Enter your name so we know what to call your workspace.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (values.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        await api.signup({ name: values.name.trim(), email: values.email, password: values.password });
      } else {
        await api.login({ email: values.email, password: values.password });
      }
      router.push('/dashboard');
      router.refresh();
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-main">
        <section className="auth-form-side">
          <Link className="auth-brand" href="/">
            <img src="/assets/brand/logo-512.png" alt="" width="44" height="44" />
            <span>Dart-OTP</span>
          </Link>
          <div className="auth-form-wrap">
            <div className="auth-mobile-art" aria-hidden="true">
              <span className="auth-art-blob">D</span>
              <img src="/assets/stickers/sticker-sparkle-yellow.svg" alt="" />
            </div>
            <span className="eyebrow"><i /> {isSignup ? 'A better way to deliver codes' : 'Good to see you again'}</span>
            <h1>{isSignup ? 'Create your account.' : 'Welcome back.'}</h1>
            <p className="auth-subtitle">
              {isSignup
                ? 'Set up your workspace and get a key when you are ready.'
                : 'Log in to manage your API keys and delivery settings.'}
            </p>
            <form className="auth-form" onSubmit={submit} noValidate>
              {isSignup && (
                <label className="form-field" htmlFor="name">
                  <span>Your name</span>
                  <input
                    autoComplete="name"
                    id="name"
                    maxLength={100}
                    onChange={(event) => setValues({ ...values, name: event.target.value })}
                    required
                    value={values.name}
                  />
                </label>
              )}
              <label className="form-field" htmlFor="email">
                <span>Email address</span>
                <input
                  autoComplete="email"
                  id="email"
                  onChange={(event) => setValues({ ...values, email: event.target.value })}
                  required
                  type="email"
                  value={values.email}
                />
              </label>
              <label className="form-field" htmlFor="password">
                <span>Password</span>
                <span className="password-wrap">
                  <input
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    id="password"
                    onChange={(event) => setValues({ ...values, password: event.target.value })}
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                  />
                  <button aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)} type="button">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </span>
              </label>
              {error && <p className="form-alert" role="alert">{error}</p>}
              <StickerButton className="auth-submit" loading={loading} type="submit">
                {loading ? 'One moment…' : isSignup ? 'Create account' : 'Log in'}
                {!loading && <span aria-hidden="true">↗</span>}
              </StickerButton>
            </form>
            <p className="auth-switch">
              {isSignup ? 'Already have an account?' : 'New to Dart-OTP?'}{' '}
              <Link href={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link>
            </p>
            <p className="auth-legal">By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
          </div>
        </section>
        <aside className="auth-art-side" aria-label="A playful illustration of a secure one-time code">
          <div className="auth-pattern" aria-hidden="true" />
          <span className="auth-side-note">A code with a better route.</span>
          <div className="auth-side-illustration" aria-hidden="true">
            <div className="auth-side-blob"><span>482 913</span></div>
            <img className="auth-side-sticker auth-side-lock" src="/assets/stickers/sticker-lock-yellow.svg" alt="" />
            <img className="auth-side-sticker auth-side-star" src="/assets/stickers/sticker-star-pink.svg" alt="" />
            <img className="auth-side-sticker auth-side-bolt" src="/assets/stickers/sticker-bolt-yellow.svg" alt="" />
          </div>
          <p>One API call to send.<br />One to verify. Done.</p>
        </aside>
      </main>
    </div>
  );
}
