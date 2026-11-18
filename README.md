# BharatBN™ — Platform Codebase

> **Mission FTC™ | Engine 7 | Bizwoke Nova**  
> **Architecture:** Hybrid WordPress/Classiera + Next.js 15 (App Router) + NestJS + Supabase PostgreSQL  
> **Documentation:** [BHARATBN_MASTER_EXECUTION_PLAN.md](BHARATBN_MASTER_EXECUTION_PLAN.md)

---

## 📁 Repository Structure

```text
bharatBN/
├── backend/                       # NestJS 10+ Modular API Engine (/api/v1)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── url-registry/      # Hybrid WordPress vs Next.js router resolver
│   │   │   ├── businesses/        # Directory listings CRUD, NAP deduplication & search
│   │   │   ├── claims/            # Business claim & verification moderation queue
│   │   │   ├── franchise/         # Enterprise Brand HQ & bulk branch importer
│   │   │   ├── leads/             # DPDP-compliant inquiries & WhatsApp attribution
│   │   │   ├── pay-as-you-rank/   # SEO campaigns & dual-proof ranking milestone engine
│   │   │   └── taxonomy/          # Geo hierarchy (Cities/States) & Categories
│   │   ├── app.module.ts
│   │   └── main.ts                # Global prefix, Swagger (/api/docs), CORS, Validation
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Next.js 15 App Router (SSR/ISR, SEO & Portals)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/          # High-conversion Homepage, Search, Profile (/biz/[slug])
│   │   │   ├── claim/[id]/        # Ownership claim with document upload
│   │   │   ├── enterprise/        # Franchise Brand network landing
│   │   │   └── dashboard/         # Franchise Branches, Leads log, Pay-As-You-Rank Tracker
│   │   ├── components/            # Navbar, Footer, SearchBar, JsonLd schema generator
│   │   ├── middleware.ts          # Hybrid routing proxy (WP fallback vs Next.js)
│   │   └── lib/api-client.ts      # Typed API client connecting to backend
│   ├── package.json
│   └── tailwind.config.ts
│
├── database/                      # Supabase / PostgreSQL Schema & Migrations
│   ├── migrations/
│   │   └── 001_initial_schema.sql # 12 Core tables with UUIDs, RLS, indexes & PostGIS
│   └── seeds/
│       └── 001_seed_taxonomy.sql  # Indian States, Tier-1/2 Cities, Categories & Pilot business
│
├── docker-compose.yml             # Local PostgreSQL + PostGIS & Redis containers
├── package.json                   # Root monorepo workspace configuration
└── BHARATBN_MASTER_EXECUTION_PLAN.md
```

---

## 🚀 Quick Start Guide

### 1. Start Local Database & Redis (Optional if using Supabase Cloud)
```bash
docker-compose up -d
```

### 2. Run the Backend API (NestJS)
```bash
cd backend
npm install
npm run start:dev
```
* **API Base:** `http://localhost:4000/api/v1`
* **Interactive Swagger Documentation:** `http://localhost:4000/api/docs`

### 3. Run the Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
* **Public Web:** `http://localhost:3000`
* **Search Directory:** `http://localhost:3000/search`
* **Franchise Enterprise Portal:** `http://localhost:3000/enterprise`
* **Operations Dashboard:** `http://localhost:3000/dashboard`

---

## 🔒 Implemented SRS Modules

* **M01 & M02 (Directory & Search):** NAP hash deduplication, slug generation, geo & category filters.
* **M03 (Business Claim):** Verification evidence upload flow with reviewer approval decision.
* **M04 (SEO Engine):** Server-side rendered HTML with automated Google `LocalBusiness` JSON-LD injection and breadcrumbs.
* **M05 (Enterprise Franchise):** Brand HQ management with bulk branch CSV validation and tenant role isolation.
* **M06 (Leads Engine):** Inquiries with explicit DPDP consent, UTM parameters, and separation between click-to-call vs verified form leads.
* **M08 (Pay-As-You-Rank™):** Milestone contract model (25% Advance, 25% Top-20, 50% Top-10) with mandatory dual SERP observations $\ge 24\text{ hours}$ apart.

