# Image Gallery SPA – Architecture

**Last updated:** February 28, 2026

## Overview

The Image Gallery is a client-side Single-Page Application built with Next.js 16, React 19, and TypeScript. It displays a masonry-style grid of placeholder images with hashtags, supports infinite scroll, and keyword filtering. UI uses Framer Motion for animations; theme toggle (Light/Dark/System) in header; nav hides on scroll down and shows on scroll up. Logo in header and footer (`public/image-gallery-icon.webp`).

## High-Level Architecture

The diagram below illustrates the application architecture (client, data layer, and flow). It satisfies the optional diagram for architecture and deployment described in the assignment.

```mermaid
flowchart TB
    subgraph Client["Browser (Client)"]
        Page["page.tsx\n(Server)"]
        Gallery["GalleryClient\n(Client)"]
        Pool["useImagePool"]
        Filter["useGalleryFilter"]
        Scroll["useInfiniteScroll"]
        Nav["useScrollDirection"]
        Grid["ImageGrid"]
        Cards["GalleryCard[]"]

        Page --> Gallery
        Gallery --> Pool
        Gallery --> Filter
        Gallery --> Scroll
        Gallery --> Nav
        Gallery --> Grid
        Grid --> Cards
        Filter --> Grid
        Scroll --> Grid
    end

    subgraph Data["Data Layer"]
        API["/api/images"]
        Mock["mock-images.ts\n(fallback)"]
    end

    Pool --> API
    Pool --> Mock
    Scroll --> Pool
    Filter --> Pool
```

## Component Hierarchy

```
page.tsx (Server)
└── GalleryClient (Client)
    ├── header (logo; ThemeToggle; visibility from useScrollDirection)
    ├── HashtagFilter
    ├── ImageGrid (ul/li)
    │   └── GalleryCard (×N)
    ├── Lightbox
    ├── Footer (logo)
    └── BackToTop
```

## Data Flow

1. **Initial Load**: `GalleryClient` mounts → `useImagePool` fetches from `/api/images` (or mock on error) → `useInfiniteScroll` slices first 12 from pool → `ImageGrid` renders `GalleryCard`s.
2. **Infinite Scroll**: IntersectionObserver watches a sentinel div → when it enters view, `displayCount` increases → more images sliced. Unobserve/re-observe after each load so scrolling back to top then down again loads more.
3. **Hashtag Filter**: User clicks hashtag → `useGalleryFilter` sets `activeHashtag` → filter function updates → `useInfiniteScroll` re-filters pool → slice reflects filtered set.

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16 (App Router)               |
| UI        | React 19, Tailwind CSS, Framer Motion |
| Language  | TypeScript                            |
| Images    | placehold.co (mock)                   |
| State     | React useState/useMemo                |
| Quality   | ESLint, Prettier, Vitest, Playwright  |

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Home route (server)
│   ├── layout.tsx
│   ├── globals.css
│   ├── components/
│   │   └── GalleryClient.tsx # Main client orchestrator
│   └── api/
│       └── images/
│           └── route.ts      # GET images (Prisma)
├── components/
│   ├── GalleryCard.tsx       # Single image + hashtags
│   ├── ImageGrid.tsx        # Masonry grid (ul/li)
│   ├── HashtagFilter.tsx     # Active filter + clear
│   ├── ThemeToggle.tsx      # Light / Dark / System theme
│   ├── Lightbox.tsx         # Full-screen viewer
│   ├── BackToTop.tsx        # Scroll-to-top button
│   └── Footer.tsx           # Footer with logo
└── lib/
    ├── constants.ts         # LABELS, logo path, PAGE_SIZE, scroll thresholds
    ├── utils.ts             # cn()
    ├── db.ts                # Prisma client
    ├── data/
    │   └── mock-images.ts   # placehold.co + hashtags
    └── hooks/
        ├── use-gallery-filter.ts
        ├── use-image-pool.ts      # Fetch API or mock
        ├── use-infinite-scroll.ts
        ├── use-masonry-columns.ts
        ├── use-responsive-columns.ts
        ├── use-scroll-direction.ts  # Nav hide on scroll down, show on scroll up
        └── use-theme.ts             # Theme (light/dark/system) + localStorage
```

## Testing Strategy

- **Unit (Vitest + RTL):** 22 test files, 117 tests, coverage 100%. Run `npm run test` or `npm run test:ci`.
- **E2E (Playwright):** 6 tests – gallery load, filter, clear filter, lightbox, back-to-top, infinite scroll. Run `npm run test:e2e`; `npm run test:e2e:report` to open HTML report.
- **Performance:** Masonry stagger uses capped delay and respects `prefers-reduced-motion`.

## API & Database

### API layer

- **GET /api/images** – Returns a JSON array of image items. Each item: `{ id, src, alt, width, height, hashtags: string[] }`. Uses Prisma to read from MySQL; on any error (e.g. DB unavailable), returns mock data from `getMockImagePool()` so the app always has data. No query params; no auth.

### Error handling

- **API:** `try/catch` in the route; on failure, fallback to mock and return 200 with mock payload (no 5xx to the client when DB is down).
- **Client:** `useImagePool` fetches `/api/images`; on network error or non-OK response, it uses mock data from `getMockImagePool()` so the gallery still renders.
- **No global error boundary** in this SPA; critical failures are limited to the data layer and handled by fallbacks.

### Database

- **Prisma + MySQL** – `Image` and `Hashtag` models. Seed: `npm run db:seed`.

## Deployment & Production

- **Vercel**: Deployed on Vercel (serverless). [Live](https://image-gallery-thanakrit-thanyawatsa.vercel.app/). Optional: add `DATABASE_URL` (PlanetScale/Neon) for real DB.
- **Docker**: `docker compose up -d` – App (Node 20 Alpine, Next.js standalone) + MySQL 8. See [docs/DEPLOY.md](./DEPLOY.md).
- **Self-host (PM2)**: Node 20, Ubuntu 22.04 LTS or equivalent; minimum 1 vCPU, 1 GB RAM. See ecosystem.config.cjs and [docs/DEPLOY.md](./DEPLOY.md).

Full server specifications, OS/software, and deployment steps are in [docs/DEPLOY.md](./DEPLOY.md).
