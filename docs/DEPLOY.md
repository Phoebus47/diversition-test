# Deployment Guide

**Last updated:** February 28, 2026

This app is **deployed on Vercel**. The live URL is in [docs/PROJECT_STATUS.md](./PROJECT_STATUS.md). Below are options for running locally or self-hosted.

## Option 1: Vercel (deployed)

The app is deployed on Vercel. Reviewers can use the live URL directly.

- **Live URL:** [https://image-gallery-thanakrit-thanyawatsa.vercel.app/](https://image-gallery-thanakrit-thanyawatsa.vercel.app/)
- Without `DATABASE_URL` on Vercel, the app uses mock data.
- To connect a database: add env var `DATABASE_URL` (e.g. PlanetScale, Neon) in Vercel project settings, then redeploy.

## Option 2: Docker (full stack locally)

```bash
# Build and run
docker compose up -d

# Initialize database (first time only)
docker compose exec app npm run db:push
docker compose exec app npm run db:seed

# Open http://localhost:3000
```

## Option 3: Ubuntu Server + PM2

```bash
# On server
npm ci
npm run build
npm run db:push   # if MySQL is running
npm run db:seed

# With standalone output
cd .next/standalone
cp -r ../static ./
cp -r ../../prisma ./
cp -r ../../node_modules/.prisma ./node_modules/
cp -r ../../node_modules/@prisma ./node_modules/
cp -r ../../public ./

# Run with PM2
pm2 start ecosystem.config.cjs
```

## Database

- **MySQL 8** required for Prisma
- **Fallback:** If `DATABASE_URL` is missing or API fails, app uses mock data (no DB needed)
