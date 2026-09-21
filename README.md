# EveryAge Digital — Production Affiliate Commerce & Owner Control Center

> **EveryAge Digital** is a curated affiliate shopping marketplace and digital-product store engineered for high trust, regulatory compliance, and seamless catalog management. Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and TypeScript.

---

## 🚀 Key Architecture & Features

1. **Integrated `/admin` Control Center**:
   - **Dashboard**: Real-time click telemetry (7d and 30d), sparkline top products, stale price alarms, and AI conversation monitoring.
   - **Products CRUD**: Full catalog management with Zod input validation, auto-slug generator, per-network affiliate URL verification, status switches (`active`, `draft`, `paused`, `archived`), and instant ISR revalidation.
   - **Affiliate Links**: Masked URL list, freshness tracking, click analytics, and bulk "Mark as checked" action.
   - **Categories**: Taxonomy management with live product counts and sort ordering.
   - **Own Products**: In-house digital resource management with checkout provider selector (`Demo`, `Lemon Squeezy`, `Paddle`), delivery info, and refund policies.
   - **Assistant Logs**: Real-time conversation audit with **Hallucination Alarm** (flags any reply referencing uncataloged items).
   - **Settings**: Amazon Associate tag (`everyagedigital-20`), Gumroad ID, price freshness expiration thresholds, and merchant credentials.

2. **Compliant Affiliate Telemetry**:
   - Outbound click redirect flow via `/api/go/[id]` (records timestamp, referrer, country, and responds with a non-cached `302` redirect).
   - Strict adherence to FTC and Google guidelines: **all outbound links enforce `rel="sponsored nofollow noopener"`**.
   - Mandatory Amazon Associate disclosure rendered near CTAs and on product pages: *"As an Amazon Associate I earn from qualifying purchases."*
   - Dynamic price freshness check (`lastCheckedAt + staleAfterDays`): stale items display *"Check live price at merchant"* instead of hardcoded amounts.

3. **Sage AI Shopping Receptionist (`/assistant`)**:
   - Strict retrieval-grounded assistant that searches the verified catalog.
   - Transparent fit reasons ("Within your budget target", "Sold by your preferred merchant", "Hands-on tested").
   - Zero hallucination guarantee: will never invent unlisted products or fake ratings.

4. **Digital Products & Payment Abstraction**:
   - Seamless checkout provider interface (`PaymentProvider`).
   - Ships with an interactive **DemoProvider** sandbox with live checkout modal, ready to toggle to **Lemon Squeezy** or **Paddle**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org)
- **UI & Runtime**: [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [Lucide React](https://lucide.dev)
- **Validation**: [Zod 4](https://zod.dev)
- **Testing**: [Vitest](https://vitest.dev) (Unit/Integration) & [Playwright](https://playwright.dev) (E2E)
- **Database / Schema**: PostgreSQL / Supabase with full SQL DDL migration in `supabase/migrations/001_initial_schema.sql`

---

## 📦 Quick Start

### 1. Installation & Environment Setup

Clone repository and install dependencies:

```bash
git clone https://github.com/technology1520-afk/everyagedigital2.git
cd everyagedigital2
npm install --legacy-peer-deps
```

Copy the environment example file:

```bash
cp .env.example .env.local
```

### 2. Development Server

Start the local server:

```bash
npm run dev
```

Visit the storefront at `http://localhost:3000`.

---

## 🔐 Owner Access & Admin Control Center

Navigate to: `http://localhost:3000/admin`

If not signed in, Next.js middleware automatically redirects unauthenticated users to `/admin/login`.

**Default Pre-Configured Credentials**:
- **Email**: `admin@everyagedigital.com` (or value of `ADMIN_EMAIL` in `.env.local`)
- **Password**: `admin12345` (or value of `ADMIN_PASSWORD` in `.env.local`)

### Adding a Product in Under 2 Minutes:
1. Navigate to `/admin/products` → click **"Add New Product"**.
2. Type a title (e.g. `Sony WH-1000XM5 Noise Canceling Headphones`).
3. The slug will auto-populate (`sony-wh-1000xm5-noise-canceling-headphones`).
4. Select category, merchant (`Amazon`), price, and paste your affiliate URL (`https://www.amazon.com/dp/...`).
5. Click **"Publish Product"**.
6. The product is immediately live on `/shop` and `/category/[slug]`. Any outbound click tracks to `/api/go/[id]`, increments clicks by +1, and logs to `/admin`!

---

## 🗄️ Database & Supabase Migration

The complete PostgreSQL DDL migration is provided in:
[`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

It creates and indexes the following tables:
- `products` (with full-text search indexes on title and description)
- `merchants` (network types, affiliate agreements)
- `affiliate_links` (URL masking, freshness timers, click counts)
- `categories` (hierarchical taxonomy and sort order)
- `collections` (curated editorial lists)
- `clicks` (granular click telemetry: timestamp, referrer, IP country)
- `assistant_logs` (AI chat sessions with hallucination alarm flags)
- `own_products` (digital downloads, licenses, refund policies)
- `admin_users` (role-based auth)

To apply migration to Supabase:
```bash
# Using Supabase CLI
supabase db push
# Or copy-paste supabase/migrations/001_initial_schema.sql into Supabase SQL Editor
```

---

## 💳 Switching from Demo Sandbox to Lemon Squeezy

To switch the digital checkout from demo sandbox to production Merchant-of-Record (MoR):

1. Set your Lemon Squeezy credentials in `.env.local`:
   ```bash
   LEMON_SQUEEZY_API_KEY=ls_live_xxxxxxxx
   LEMON_SQUEEZY_STORE_ID=12345
   LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
   ```
2. In `/admin/own-products`, open the desired digital product and change the **Checkout Gateway Provider** dropdown from `Demo Sandbox` to `Lemon Squeezy (MoR)`.
3. Click **"Update Product Details"**.

---

## 🧪 Testing & Quality Assurance

### Vitest Unit & Compliance Tests (38/38 passing):
```bash
npm test
```
Verifies:
- Repository CRUD and Zod schema rejection of invalid affiliate links
- Slug uniqueness enforcement
- Click redirect flow (`/api/go/[id]` 302 + click counter +1)
- Compliance check (ensuring all outbound merchant anchors render `rel="sponsored nofollow noopener"`)
- Grep test verifying absence of fake reviews, false urgency countdowns, or deceptive marketing
- Unauthenticated middleware redirection
- Section 4 Owner workflow end-to-end

### ESLint & Production Build:
```bash
npm run lint
npm run build
```
All 52 public and administrative routes build statically or dynamically with 0 errors.

---

## 📜 Regulatory & Editorial Compliance

- **FTC Disclosure**: Transparently presented on the homepage, `/about`, `/affiliate-disclosure`, `/methodology`, and next to every outbound merchant CTA button.
- **Amazon Associates**: Full compliance with Amazon Operating Agreement section 5, rendering the official statement across relevant pages.
- **Link Quality**: All outbound links carry `rel="sponsored nofollow noopener"` and maintain canonical search engine meta tags.

---

## 📄 License

Private commercial repository. All rights reserved by **EveryAge Digital**.
