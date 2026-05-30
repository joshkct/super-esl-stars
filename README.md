# Verbjective

Production-grade online English tutoring platform.

- **Framework:** Next.js 14 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS (academic design system)
- **Backend / Auth:** Supabase (Postgres, RLS, Realtime, Storage)
- **Email:** Resend + React Email
- **Invoices:** `@react-pdf/renderer` (invoice-based payments, no gateway yet)
- **i18n:** `next-intl` (cookie-based locale, English by default)
- **Deploy target:** Vercel

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in the values

# 3. Run the database migrations + seed (requires the Supabase CLI)
supabase db reset            # applies /supabase/migrations then /supabase/seed.sql

# 4. Start the dev server
npm run dev
```

Visit http://localhost:3000.

## Useful scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the Next.js dev server             |
| `npm run build`     | Production build                         |
| `npm run typecheck` | Strict TypeScript check (`tsc --noEmit`) |
| `npm run lint`      | ESLint                                   |
| `npm run email`     | Preview React Email templates locally    |

## Project structure

```
app/
  (public)/        Landing, contact, sign-in, sign-up
  (protected)/     Auth-guarded dashboards (student, tutor)
components/        ui / tutor / student / emails / pdf
i18n/              next-intl request config + locale helpers
lib/               supabase clients, auth, pricing, invoice, resend, validations
messages/          translation files (en.json + future locales)
supabase/          migrations + seed.sql + config.toml
types/             shared TypeScript types & typed Database schema
middleware.ts      route protection + role gating
```

## Conventions

- TypeScript **strict**, no `any`.
- Server Components by default; `'use client'` only where needed.
- Forms use **React Hook Form + Zod**.
- Dates stored in **UTC**, displayed in the user's local timezone.
- Money stored as **integer ZAR cents**.
- Row Level Security enforced on every table.

## Regenerating database types

```bash
supabase gen types typescript --linked > types/database.ts
```
