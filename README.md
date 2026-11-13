# Dart-OTP Frontend

**The dashboard and public site for Dart-OTP.**

Dart-OTP replaces SMS one-time passcodes with Telegram delivery. This repository contains the public marketing site, developer docs stub, auth screens, and the tenant dashboard used to manage API keys, templates, logs, and webhooks.

This frontend is built to match the backend contract in the companion `dart-otp` repository and is intended to work alongside the API service that handles code generation, verification, quotas, rate limits, and Telegram delivery.

---

## What this repo includes

- Marketing landing page for the product
- Auth screens for login and signup
- Dashboard shell and tenant views for:
  - overview
  - API keys
  - templates
  - logs
  - webhooks
  - settings
- Static legal pages for terms and privacy
- Docs stub and 404/error flows
- Styling system based on the design brief and the supplied assets pack
- Proxy configuration for `/api/*` requests to the backend

---

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style primitives heavily restyled
- TanStack Query
- react-hook-form + zod
- sonner toasts
- Framer Motion-compatible `motion` package
- lucide-react icons
- Recharts for dashboard charts

---

## Project structure

```text
app/
  dashboard/
  design/
  docs/
  login/
  signup/
  terms/
  privacy/
  layout.tsx
  page.tsx
  globals.css
components/
  auth-form.tsx
  dashboard-shell.tsx
  design-showcase.tsx
  site.tsx
  ui.tsx
lib/
  api.ts
  display.ts
  plans.ts
  utils.ts
tokens/
  tokens.css
public/
  assets/
  ...
.env.example
.gitignore
middleware.ts
next.config.mjs
package.json
tailwind.config.ts
tsconfig.json
```

---

## Environment

Copy `.env.example` and fill in the values used by the app:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_URL=http://localhost:3001
```

`API_URL` is used by the proxy layer in `next.config.mjs` for `/api/:path*` rewrites. `NEXT_PUBLIC_SITE_URL` is the public frontend URL.

---

## Local development

From the repo root:

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

The app expects the backend service to exist on `API_URL` for real API calls. If the backend is not running, the frontend should still render but API routes will fail gracefully.

---

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

`typecheck` is mapped to `tsc --noEmit` in `package.json`.

---

## Design and asset notes

- The repository is intentionally built around the included asset pack under `public/assets`.
- The unused `reference/` folder is excluded from git.
- The `ASSETS_README.md` file is ignored and not committed to the repository because it is an asset pack guide rather than a source file for the project.

---

## Backend compatibility

This repo follows the backend API contract from the companion Dart-OTP backend repository, including:

- error shape: `{ error: { code, message } }`
- public OTP endpoints under `/v1/otp/*`
- dashboard auth cookie: `dartotp_session`
- API key and template semantics
- webhook events and tenant-scoped API model

---

## License

This frontend repository is proprietary software. See `LICENSE` for the terms governing use, copying, modification, and redistribution.

---

## Relationship to the backend

The backend repository is a separate project and is not a dependency in this folder. The frontend is intentionally designed to call the backend over the Next.js proxy route and to match the API contract, not to reimplement backend logic.
