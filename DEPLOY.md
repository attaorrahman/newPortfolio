# Deploy guide — attaurrahman.dev

This portfolio runs on **Vercel + Supabase + Resend**. Setup takes ~15 minutes.

---

## 1. Supabase (database)

1. Create a free project at https://supabase.com
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, hit **Run**.
3. Open **Project Settings → API** and copy three values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this secret (server only)

---

## 2. Resend (email)

1. Sign up at https://resend.com (free 3,000 emails/month).
2. **API Keys → Create API Key** → copy → `RESEND_API_KEY`.
3. For the `from` address:
   - **Quick start (testing):** use `RESEND_FROM="Atta Portfolio <onboarding@resend.dev>"` — works immediately.
   - **Production (recommended):** add `attaurrahman.dev` in **Domains**, follow DNS instructions, then use `RESEND_FROM="Atta <hello@attaurrahman.dev>"`.

---

## 3. Admin password

Generate the bcrypt hash for your admin password:

```bash
node scripts/hash-password.mjs YourStrongPasswordHere
```

Copy the output into `ADMIN_PASSWORD_HASH`.

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy into `ADMIN_SESSION_SECRET`.

---

## 4. Local env

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Then:

```bash
npm run dev
```

Visit:
- `http://localhost:3000` — public site
- `http://localhost:3000/admin/login` — admin

---

## 5. Deploy to Vercel

1. Push the repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. In the import wizard, **Environment Variables**, add **all** keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM`
   - `OWNER_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `ADMIN_SESSION_SECRET`
   - `NEXT_PUBLIC_SITE_URL=https://attaurrahman.dev`
4. Click **Deploy**.
5. After first deploy, go to **Settings → Domains** → add `attaurrahman.dev` and `www.attaurrahman.dev`. Vercel will give you the DNS records to add at your registrar.

---

## What's wired up

| Feature | How it works |
|---|---|
| Contact form | `POST /api/contact` → saves row in `contacts` + emails owner via Resend |
| Meeting scheduling | `POST /api/meetings/availability` lists booked slots; `POST /api/meetings` books with overlap-protection (Postgres EXCLUDE constraint) and emails both you and the visitor |
| Visitor tracking | Every page view sent to `POST /api/track`; daily-rotated SHA-256 IP hash for unique-visitor counts (no raw IPs stored) |
| Admin dashboard | `/admin` (password-protected). Tabs: Overview (stats + 30-day chart + top pages), Meetings (confirm/cancel), Messages |
| Auth | bcrypt-hashed password + JWT session in HTTP-only cookie, 7-day TTL |
| Privacy | Tables protected by Supabase RLS; all access goes through server with service-role key; anon key cannot read data |

---

## Useful tips

- **Forgot admin password?** Re-run `scripts/hash-password.mjs` and update the `ADMIN_PASSWORD_HASH` env var in Vercel.
- **Rotate session secret to invalidate all sessions:** change `ADMIN_SESSION_SECRET` in Vercel — every existing cookie becomes invalid.
- **No emails arriving?** Check Resend dashboard logs. If `RESEND_API_KEY` is blank the route still saves to DB but skips email.
- **Inspect production traffic:** Vercel dashboard → Deployments → Functions tab.
