# Deploying AI Safety Tree to Vercel + aisafetytree.com

## TL;DR

1. Spin up a Postgres database (Neon's free tier is the easiest).
2. Flip `prisma/schema.prisma` from `sqlite` → `postgresql`.
3. Import the GitHub repo into Vercel; set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
4. Run `prisma db push` once against the production database, then `npm run db:seed`.
5. Add `aisafetytree.com` in Vercel → Domains, copy the DNS records to your registrar.

The current dev setup uses **SQLite**, which won't survive on Vercel's ephemeral filesystem. The migration is one schema-line change plus a one-time seed.

---

## 1. Provision Postgres

### Option A — Neon (recommended, easiest free tier)
1. Sign in at <https://neon.tech>.
2. *New Project* → name it `ai-safety-tree`, region close to your users.
3. Copy the **pooled** connection string (the one with `-pooler.` in the host). That's `DATABASE_URL`.
4. Optionally copy the **direct** connection string for migrations (`DIRECT_URL`).

### Option B — Vercel Postgres
1. In your Vercel project: *Storage* → *Create Database* → Postgres.
2. Vercel auto-injects `POSTGRES_URL` (and friends). Use the `POSTGRES_PRISMA_URL` value as `DATABASE_URL`.

Either works.

---

## 2. Switch Prisma to Postgres

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

Push to a feature branch and merge — Vercel will redeploy.

---

## 3. Vercel project setup

1. <https://vercel.com/new> → import `Mark-Kagach/ai-safety-tree`.
2. Framework preset: **Next.js** (auto-detected).
3. Build & Output Settings: keep defaults. The repo includes `"postinstall": "prisma generate"` so the Prisma client is always re-built.
4. Environment Variables (Project Settings → Environment Variables):

   | Name | Value | Environments |
   |---|---|---|
   | `DATABASE_URL` | the Postgres connection string from step 1 | Production, Preview, Development |
   | `NEXTAUTH_SECRET` | a random 32+ char string (`openssl rand -hex 32`) | Production, Preview |
   | `NEXTAUTH_URL` | `https://aisafetytree.com` once domain is connected, else the `*.vercel.app` URL | Production, Preview |

5. Click **Deploy**.

The first deploy will likely fail because the DB is empty. That's fine — fix it in step 4.

---

## 4. Initialise the production DB

Locally, with the same `DATABASE_URL` exported temporarily:

```bash
# from the project root, with DATABASE_URL pointing at production Postgres
DATABASE_URL="<your prod url>" npx prisma db push
DATABASE_URL="<your prod url>" npm run db:seed
```

`db push` creates the tables. `db:seed` loads the 97 nodes + outputs.

(For a fully reproducible production workflow, replace `db push` with proper migrations: `npx prisma migrate dev --name init` once locally to commit `prisma/migrations/`, then Vercel can run `prisma migrate deploy` on each build. For v1 the lighter-weight `db push` is fine.)

---

## 5. Connect aisafetytree.com

1. In Vercel: *Settings* → *Domains* → *Add* → enter `aisafetytree.com`.
2. Vercel will show DNS records — typically:

   | Host | Type | Value |
   |---|---|---|
   | `@` (apex / root) | `A` | `76.76.21.21` |
   | `www` | `CNAME` | `cname.vercel-dns.com` |

3. Add those records at your domain registrar (Namecheap / GoDaddy / Cloudflare / etc.). Cloudflare users: set the records to **DNS-only** (grey cloud, not orange) for the initial verification.
4. Wait for DNS propagation (usually 1–10 min).
5. Vercel will auto-issue an SSL cert via Let's Encrypt once DNS resolves.

After the apex domain works, also add `www.aisafetytree.com` in Vercel and set it to redirect to the apex.

---

## 6. Update `NEXTAUTH_URL`

Once `https://aisafetytree.com` resolves, set `NEXTAUTH_URL=https://aisafetytree.com` in Vercel env vars and redeploy. This makes session cookies work on the production hostname.

---

## Caveats

- **NextAuth wasn't actually used**: this project ships its own minimal cookie-based auth (`src/lib/auth.ts` + `src/lib/session.ts`), but it reads `NEXTAUTH_SECRET` for the HMAC-signing key, so the env var name is meaningful.
- **Mark's seed user** (`mark / changeme`) is created by the seed script. Change the password (or sign up a fresh admin) before opening the site to others.
- The build will warn about the React Flow `nodeTypes` re-creation — that's a dev-mode HMR artefact, harmless in production.
