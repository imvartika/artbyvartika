# Vartika Collection

The website for Vartika's art — pottery, paintings, sketches, crochet, photography, and 3D/Blender work. Built as a portfolio + small shop + commission-request site, with a private studio area for managing it all.

- **Live site:** https://artbyvartika.store
- **Studio (admin) login:** https://artbyvartika.store/admin/login

---

## For Vartika — using the site

### Logging in
Go to the link in the footer marked **"studio"**, or straight to `/admin/login`. If you don't have a password yet (or forgot it), tap **"Forgot password? Email me a reset link"** — a link will arrive at your email within a minute or two and let you set one.

### Adding or editing art
Once logged in, `/admin` lists everything on the site.
- **"Add new"** — upload photos, write a title/description, pick a craft category, and mark it "for sale" with a price if you want people to be able to reserve it.
- Click any existing piece to edit or delete it.
- **Multiple photos on one piece** show up as a "the making of" sequence on the site (great for process shots — sketch → painting → final, etc.).

### Inbox
`/admin/inbox` shows every commission request and "reserve to buy" submission, with a status you can update (new → contacted → confirmed → completed).

### Site settings
`/admin/settings` lets you change your name, bio, profile photo, contact email, Instagram/YouTube links, and the birthday-surprise message — all without touching any code.

### The birthday surprise
`/my-birthday` is a standalone page with a personal note and confetti — not linked anywhere on the site on purpose. Share the link directly with whoever it's for.

---

## For whoever maintains this technically

### The stack
- **Framework:** Next.js 16 (App Router), Tailwind, Framer Motion
- **Hosting:** Vercel
- **Database/Auth/Storage:** Supabase
- **Transactional email:** Resend (via Supabase's custom SMTP)
- **Domain/DNS:** Spaceship

### Where everything lives

| Piece | Where | Why it matters |
|---|---|---|
| **Code** | GitHub — `imvartika/artbyvartika`, `main` branch | Source of truth. A push to `main` auto-deploys to production via Vercel's Git integration. |
| **Hosting** | Vercel — account `vartika3` (Vartika's own account), project `vartika-collection` | Runs the actual site. Environment variables (below) live here, under Project Settings → Environments. |
| **Database** | Supabase project `cbsdnaeroopayopohpra` (Vartika's own account) | Holds every artwork, category, commission/buy request, and site setting. `supabase/migrations/*.sql` in the repo is the schema history — if you ever need a fresh copy of the DB, those files rebuild it from scratch. |
| **Admin accounts** | Supabase → Authentication → Users, cross-referenced against the `admins` table | Only emails present in the `admins` table can access `/admin`, even if they have a valid login — this is enforced by Row Level Security, not just page code. |
| **Email sending** | Resend account (Vartika's own), domain `artbyvartika.store` verified | Supabase's Auth emails (password reset, invites) are routed through Resend's SMTP so they reliably reach any inbox, not just test addresses. If this domain's DNS is ever moved to a new host, the DKIM/SPF/DMARC records in Resend's dashboard need to be re-added there too, or email delivery breaks silently. |
| **Domain + DNS** | Spaceship (Vartika's own account), domain `artbyvartika.store` | DNS records here point the domain at Vercel (`A` records for `@` and `www`) and at Resend (DKIM/SPF/DMARC records for email). Both are independent — losing one doesn't affect the other. |

### Environment variables (set in Vercel, not in the repo)
```
NEXT_PUBLIC_SUPABASE_URL       — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  — public, RLS-restricted key (safe to expose to browser)
SUPABASE_SERVICE_ROLE_KEY      — full-access key, server-only, never expose to the browser
```
These are **not** committed to git (`.env.local` is gitignored) — copy the values from Vercel's dashboard or Supabase's Settings → API page if you need them locally.

### Deploying a change
```bash
git push origin main
```
That's it — Vercel picks up the push and deploys automatically. No manual `vercel --prod` needed for this project going forward.

### Database migrations
New schema changes go in `supabase/migrations/NNNN_description.sql`, applied by pasting into Supabase's SQL Editor (Dashboard → SQL Editor) — there's no automated migration runner set up, so each new `.sql` file needs to be run manually once.

### Repo visibility
Safe to make this repository **private** at any time — Vercel's GitHub integration is authorized per-repo via a GitHub App installation, which isn't affected by switching a repo from public to private. No redeploy or reconnection needed.
