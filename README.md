# Image Gallery SPA

Single-Page Application for displaying an image gallery with infinite scroll and keyword filtering.

## Key Features

- **Premium UI & UX** – Glassmorphism, tailored animations, and vibrant design system using Tailwind v4.
- **Advanced Masonry Layout** – Stable JavaScript-based distribution algorithm that eliminates layout shift (Zero Layout Shift) during infinite scroll.
- **Interactive Lightbox** – Full-screen modal with Next/Prev navigation, keyboard support (Arrow keys/ESC), and zoom transitions.
- **Performance Optimized** – LCP priority loading, skeleton shimmer states, and hardware-accelerated transitions.
- **Infinite Scroll** – Intelligent loading with smooth sentinel detection and animated feedback.
- **Keyword Filtering** – Dynamic active filtering with frosted-glass sticky header for constant accessibility.
- **Micro-interactions** – Ripple effects on hashtag clicks and subtle card entrance animations for elite feedback.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Quality:** ESLint, Prettier, Vitest, SonarQube, Husky, Commitlint
- **CI/CD:** GitHub Actions

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

| Command          | Description                   |
| ---------------- | ----------------------------- |
| `npm run dev`    | Run development server        |
| `npm run build`  | Build for production          |
| `npm run start`  | Run production server         |
| `npm run lint`   | Run ESLint                    |
| `npm run format` | Format code with Prettier     |
| `npm run test`   | Run unit tests                |
| `npm run sonar`  | Run SonarQube scan (optional) |

### Project Structure

```
src/
├── app/          # App Router pages
├── components/   # Shared components
└── lib/          # Utils, hooks, data

__tests__/        # Test files
docs/             # Documentation
```

## Documentation

- [PRD.md](./PRD.md) – Product Requirements Document
- [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md) – Coding standards
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) – Architecture diagram
- [SETUP.md](./SETUP.md) – Setup guide

## Deployment

Build for production:

```bash
npm run build
npm run start
```

Or deploy to Vercel, Docker, or Ubuntu Server according to your architecture design.
