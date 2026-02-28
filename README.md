# Image Gallery SPA

**Last updated:** February 28, 2026

Single-Page Application for displaying an image gallery with infinite scroll and keyword filtering.

**Live:** [https://image-gallery-thanakrit-thanyawatsa.vercel.app/](https://image-gallery-thanakrit-thanyawatsa.vercel.app/)

## Key Features

- **Logo** – Header and footer use `public/image-gallery-icon.webp`.
- **Premium UI & UX** – Glassmorphism, Framer Motion animations, and design tokens (Tailwind v4). Nav hides on scroll down, shows on scroll up.
- **Advanced Masonry Layout** – Stable JavaScript-based distribution algorithm that eliminates layout shift (Zero Layout Shift) during infinite scroll.
- **Interactive Lightbox** – Full-screen modal with Next/Prev navigation, keyboard support (Arrow keys/ESC), and zoom transitions.
- **Performance Optimized** – LCP priority loading, skeleton shimmer states, and hardware-accelerated transitions.
- **Infinite Scroll** – Intelligent loading with smooth sentinel detection and animated feedback.
- **Keyword Filtering** – Dynamic active filtering with frosted-glass sticky header for constant accessibility.
- **Micro-interactions** – Ripple effects on hashtag clicks and subtle card entrance animations for elite feedback.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Quality:** ESLint, Prettier, Vitest, SonarQube, Husky, Commitlint
- **CI/CD:** GitHub Actions

## Code quality

All checks must pass before submit. Current bar:

- **ESLint** – `npm run lint` (no errors/warnings)
- **Prettier** – `npm run format:check`
- **TypeScript** – `npm run type-check`
- **Unit tests** – `npm run test:coverage` (100% coverage)
- **E2E** – `npm run test:e2e` (Playwright)
- **SonarQube** – `npm run sonar` (Quality Gate pass: 0 open issues, 100% coverage, no duplications). Optional; see SETUP.md for Docker.

See [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) for full standards.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `npm run dev`             | Run development server         |
| `npm run build`           | Build for production           |
| `npm run start`           | Run production server          |
| `npm run lint`            | Run ESLint                     |
| `npm run format`          | Format code with Prettier      |
| `npm run test`            | Run unit tests (Vitest)        |
| `npm run test:coverage`   | Run tests with coverage report |
| `npm run test:e2e`        | Run E2E tests (Playwright)     |
| `npm run test:e2e:ui`     | Run E2E tests with UI mode     |
| `npm run test:e2e:report` | Open Playwright HTML report    |
| `npm run sonar`           | Run SonarQube scan (optional)  |

### Project Structure

```
src/
├── app/          # App Router pages
├── components/   # Shared components
└── lib/          # Utils, hooks, data

__tests__/        # Unit tests (Vitest)
e2e/              # E2E tests (Playwright)
docs/             # Documentation
```

## Database (Optional)

With MySQL, the app uses the API. Without it, mock data is used.

```bash
# Set DATABASE_URL in .env (see .env.example)
npm run db:generate
npm run db:push
npm run db:seed
npm run db:studio   # Optional: Prisma Studio UI
```

## Ways to run (for reviewers)

You can run and test the app in three ways:

| Option          | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vercel**      | **Deployed.** [Live URL](https://image-gallery-thanakrit-thanyawatsa.vercel.app/). No setup required. Uses mock data when no database is connected.          |
| **Docker**      | From the project folder: `docker compose up -d`, then `docker compose exec app npm run db:push && npm run db:seed`. App at http://localhost:3000 with MySQL. |
| **Zip / Clone** | Unzip or clone the repo → `npm install` → `npm run dev` → open http://localhost:3000. Uses mock data when no database is configured.                         |

See [docs/DEPLOY.md](./docs/DEPLOY.md) and [SETUP.md](./SETUP.md) for details.

## Documentation

- [PRD.md](./PRD.md) – Product Requirements Document
- [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) – **Project status (what’s done)**
- [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) – Coding standards
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) – Architecture diagram
- [docs/DEPLOY.md](./docs/DEPLOY.md) – Deployment guide
- [SETUP.md](./SETUP.md) – Setup guide

## Deployment

- **Vercel**: App is deployed on Vercel. See [docs/DEPLOY.md](./docs/DEPLOY.md) for details.
- **Docker**: `docker compose up -d` – App + MySQL (see [docs/DEPLOY.md](./docs/DEPLOY.md))
- **Ubuntu + PM2**: See [docs/DEPLOY.md](./docs/DEPLOY.md)

Build for production:

```bash
npm run build
npm run start
```
