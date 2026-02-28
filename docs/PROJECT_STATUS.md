# Project Status – Image Gallery SPA

**Last updated:** February 28, 2026  
**Deadline:** March 1, 2026, 8:00 PM  
**Submit to:** hr@diversition.co.th

---

## Summary

| Area                  | Status         |
| --------------------- | -------------- |
| **PRD features**      | ✅ Implemented |
| **Architecture doc**  | ✅ Done        |
| **Deploy doc**        | ✅ Done        |
| **Tests & coverage**  | ✅ 100% (unit) |
| **Quality gates**     | ✅ All passing |
| **Deploy / Live URL** | ⏳ Optional    |

---

## Done

### 1. Setup & infrastructure

- Next.js 16, React 19, TypeScript, Tailwind v4
- ESLint, Prettier, Vitest, SonarQube, Husky, Commitlint
- GitHub Actions CI
- Docker (SonarQube)
- docs/CODING_STANDARDS.md, SETUP.md

### 2. PRD features

| PRD item                    | Implementation                                                       |
| --------------------------- | -------------------------------------------------------------------- |
| **2.1 Gallery display**     | GalleryClient, ImageGrid, GalleryCard, mock/API data                 |
| **2.2 Infinite scroll**     | useInfiniteScroll, sentinel, load more                               |
| **2.3 Dynamic image sizes** | Masonry (useMasonryColumns, useResponsiveColumns), zero layout shift |
| **2.4 Unlimited hashtags**  | Per-image hashtags array, HashtagFilter                              |
| **2.5 Keyword filtering**   | useGalleryFilter, active tag, filter by hashtag                      |
| **Placehold.co + mock**     | mock-images.ts, API /api/images (Prisma when DB present)             |

### 3. UI/UX

- Glassmorphism, design system (globals.css)
- Lightbox (full-screen, next/prev, keyboard, zoom)
- BackToTop, Footer
- Ripple on hashtag click, card animations, shimmer loading
- Sticky HashtagFilter

### 4. Data & API

- `src/lib/data/mock-images.ts` – placehold.co URLs + hashtags
- `src/app/api/images/route.ts` – GET images (Prisma or fallback)
- `src/lib/db.ts` – Prisma client
- Optional: MySQL + Prisma (db:generate, db:push, db:seed)

### 5. Documentation

- PRD.md – requirements
- docs/CODING_STANDARDS.md – coding standards
- docs/ARCHITECTURE.md – diagram (Mermaid), stack, deploy
- docs/DEPLOY.md – Docker, Vercel, Ubuntu + PM2
- SETUP.md – local setup
- README.md – features, scripts, docs links

### 6. Tests

- **Unit:** 19 test files, 85 tests (Vitest + RTL), coverage thresholds 98%
- **E2E:** Playwright (test:e2e) – 4 tests
- Covered: GalleryCard, ImageGrid, HashtagFilter, Lightbox, BackToTop, Footer, GalleryClient, page, layout, API route, hooks (infinite-scroll, image-pool, gallery-filter, masonry, responsive-columns), mock-data, utils, db

### 7. Quality

- `npm run lint` – pass
- `npm run format:check` – pass
- `npm run type-check` – pass
- `npm run test:ci` – pass
- `npm run build` – pass
- `npm run sonar` – pass (SonarQube)

---

## Optional / not done

- **Deploy & Live URL** – Deploy to Vercel/Docker/Ubuntu and send URL (recommended)

---

## Key files

| Path                                   | Purpose                                         |
| -------------------------------------- | ----------------------------------------------- |
| `src/app/page.tsx`                     | Home, renders GalleryClient                     |
| `src/app/components/GalleryClient.tsx` | Client gallery, filter + scroll + grid          |
| `src/components/GalleryCard.tsx`       | Single card, image + hashtags, lightbox trigger |
| `src/components/ImageGrid.tsx`         | Masonry grid                                    |
| `src/components/HashtagFilter.tsx`     | Sticky tag filter                               |
| `src/components/Lightbox.tsx`          | Full-screen viewer                              |
| `src/components/BackToTop.tsx`         | Scroll-to-top button                            |
| `src/components/Footer.tsx`            | Footer branding                                 |
| `src/lib/hooks/use-image-pool.ts`      | Fetch from API or mock fallback                 |
| `src/lib/hooks/use-infinite-scroll.ts` | Sentinel-based load more                        |
| `src/lib/hooks/use-gallery-filter.ts`  | Filter by hashtag                               |
| `src/lib/hooks/use-masonry-columns.ts` | Masonry layout distribution                     |
| `src/lib/data/mock-images.ts`          | Mock data (placehold.co)                        |
| `src/app/api/images/route.ts`          | GET images API                                  |
| `docs/ARCHITECTURE.md`                 | Architecture diagram                            |
| `docs/DEPLOY.md`                       | Deployment guide                                |
