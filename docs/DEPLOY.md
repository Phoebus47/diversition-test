# Deployment Guide

**Last updated:** February 28, 2026

## Option 1: Docker (Recommended for full stack)

```bash
# Build and run
docker compose up -d

# Initialize database (first time only)
docker compose exec app npm run db:push
docker compose exec app npm run db:seed

# Open http://localhost:3000
```

## Option 2: Vercel (Frontend + API)

1. Connect repo to Vercel
2. Add env var: `DATABASE_URL` (e.g. PlanetScale, Neon)
3. Deploy – Vercel runs `prisma generate && next build`
4. If no DB: app falls back to mock data

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
