# 📖 ReviewScout — Master Project Blueprint & Documentation (A to Z)

**Project Name:** ReviewScout (pSEO Monetization Engine)  
**Live Production URL:** `https://review-scout-bbbc.vercel.app`  
**GitHub Repository:** `https://github.com/adminai0911-jpg/ReviewScout.git`  
**Deployment Platform:** Vercel (Serverless / App Router)  
**Primary Database:** Supabase (PostgreSQL)  
**Documentation Version:** 2.2 (Vercel Double Limit Zero-Cost Optimization Release)

---

## 🛠️ 1. Tech Stack & Architecture

- **Framework:** Next.js 16.2.10 (App Router)
- **UI Library:** React 19 + Tailwind CSS v4 + Glassmorphism Styling
- **AI Core:** Google Gemini AI (`gemini-2.5-flash`) with load balancing across 9 API keys
- **Database:** Supabase Client (`@supabase/supabase-js`)
- **Autopilot Automation:** Cloud-based trigger via `cron-job.org` + Next.js `after()` background execution
- **Link Proxy / Cloaker:** `/api/go` (Handles geo-redirection & affiliate tag injection)

---

## ⚡ 2. Vercel Free Tier Double Limit Fix (100% Free Lifetime Guarantee)

### Issue A: ISR Data Cache Writes (200,000 Limit)
- **Problem:** `export const revalidate = N` was forcing Vercel to write HTML files to Vercel Data Cache on every background revalidation.
- **Solution:** Purged all `revalidate = N` statements. Converted pages to standard dynamic rendering (`export const dynamic = 'force-dynamic'`).
- **Result:** **0 Data Cache Writes** per month.

### Issue B: Fast Origin Transfer (10 GB Limit)
- **Problem:** Dynamic SSR without Edge CDN headers forced every bot/user request to hit the Vercel Origin Serverless Function, consuming 10 GB of Fast Origin Transfer.
- **Solution:** Added Vercel Edge CDN headers in `next.config.ts`:
  ```typescript
  Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400
  ```
- **Result:** Vercel's Edge Network CDN caches pages globally for 7 days. Requests are served from the **100 GB Fast Data Transfer Pool** instead of Origin. Fast Origin Transfer drops by **99%** to near **0 GB**.

---

## 💰 3. Universal 10-Platform Monetization Matrix

All outbound links in body text and the live comparison table route through `/api/go` to maximize conversions.

| # | Retailer / Network | Target Market | Verified Tracking ID | Integration Mechanism |
|---|--------------------|---------------|----------------------|-----------------------|
| 1 | **Amazon** | Global | `inamazon0f2-21` | Geo-Router domain rewrite (`.com`, `.co.uk`, `.in`, `.de`, etc.) |
| 2 | **Etsy** | Custom / Handmade | Awin ID: `3003527` | Awin Deep Link Generator (Merchant `6220`) |
| 3 | **DHgate / B2B** | Wholesale Hardware | ShareASale ID: `3003527` | ShareASale Universal Search (Merchant `42409`) |
| 4 | **Digistore24** | Digital Courses / AI | `adminai091181b6` | Offer ID `299134` (Tube Mastery - 50%+ Commission) |
| 5 | **Flipkart** | India | EarnKaro ID `5476200` | EarnKaro Tag (`ekaro_5476200`) |
| 6 | **Croma** | India Electronics | EarnKaro ID `5476200` | EarnKaro Tag (`ekaro_5476200`) |
| 7 | **AliExpress** | Global Cheap Goods | Skimlinks ID `307054X1795329` | Skimlinks Explicit Redirect (`go.redirectingat.com`) |
| 8 | **eBay** | Global Refurbished | Skimlinks ID `307054X1795329` | Skimlinks Explicit Redirect (`go.redirectingat.com`) |
| 9 | **Walmart** | US Local Deals | Skimlinks ID `307054X1795329` | Skimlinks Explicit Redirect (`go.redirectingat.com`) |
| 10| **BestBuy** | Tech / Electronics | Skimlinks ID `307054X1795329` | Skimlinks Explicit Redirect (`go.redirectingat.com`) |

---

## 🤖 4. Autonomous pSEO Generation Engine

- **API Endpoint:** `/api/generate-pseo`
- **Cron Token:** `Bearer ReviewScout-Cron-Token-9f8a7b6c5d4e`
- **Trigger Provider:** `cron-job.org` (Configured to execute periodically)
- **Background Execution Pattern:**
  ```typescript
  // Responds to cron-job.org in 100ms to prevent HTTP 30s timeouts
  after(async () => {
    // Executes Gemini AI 600-word review generation in background
    // Inserts record into Supabase 'articles' table
  });
  ```
- **Combinatorial Matrix:** `PRODUCTS` (30+) × `LOCATIONS` (30 Cities / 10 Languages) × `USE_CASES` (5) = **1,000+ Unique Articles**.

---

## 🗄️ 5. Supabase Database Schema

### Table: `articles`
```sql
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  category TEXT DEFAULT 'Electronics',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### Table: `subscribers`
```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---

## 🌐 6. SEO, Tracking & Verification Tags

- **Google AdSense:** `ca-pub-4477459074077400` (Integrated in `layout.tsx` & `metadata`)
- **Google Analytics:** `G-KRL5RH2H00`
- **Impact Verification:** `b7f81974-6121-406a-af7d-a04020931ed0`
- **Google Search Console Verification:** `bc5hPzXstw6y8lpbiXYdEHfTSZkySuSi5XR-MD4lJZQ`
- **Skimlinks Global Script:** `https://s.skimresources.com/js/307054X1795329.skimlinks.js`
- **Dynamic Sitemap:** `/sitemap.xml`

---

## ⚙️ 7. Maintenance & Scaling Operations

1. **How to add new products/keywords to the AI:**
   Edit `src/app/api/generate-pseo/route.ts` and add items to the `PRODUCTS` array.
2. **How to change cron frequency:**
   Log into `cron-job.org`, select your job, and adjust the schedule (e.g., every 15 minutes or 30 minutes).
3. **How to update affiliate IDs:**
   Update `affiliateIds` in `src/components/AutoLinker.ts` and `src/components/PriceComparisonTable.tsx`.
4. **How to test local builds:**
   Run `npm run build` in the terminal to verify zero TypeScript errors.

---

*This blueprint is permanently saved in the codebase root as `PROJECT_MASTER_DOCUMENTATION.md` for future reference.*
