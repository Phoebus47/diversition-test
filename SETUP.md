# Setup Guide – Image Gallery SPA

**Last updated:** February 28, 2026

Step-by-step project setup guide (run `npx create` yourself). The app is also **deployed on Vercel**: [https://image-gallery-thanakrit-thanyawatsa.vercel.app/](https://image-gallery-thanakrit-thanyawatsa.vercel.app/).

---

## Step 1: Create Next.js Project

**Option 1 – Create in empty folder (recommended)**

```bash
cd ~/projects
npx create-next-app@latest image-gallery --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd image-gallery
```

Then copy files from this repo (PRD.md, SETUP.md, .cursorrules, .cursor/, .github/, .docker/, and root config files) into the project.

**Option 2 – Create in existing folder**

```bash
cd your-project-folder
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

If the folder is not empty, you may need to move config files out first, then copy them back after create.

Answer prompts:

- Would you like to use Turbopack? → **No** (or Yes if preferred)
- Would you like to customize the default import alias? → **No**

---

## Step 2: Install Dependencies for Quality Gates

```bash
npm install -D prettier eslint-config-prettier
npm install -D @commitlint/cli @commitlint/config-conventional
npm install -D husky lint-staged
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom vite-tsconfig-paths
npm install -D dotenv-cli sonarqube-scanner
npm install -D @eslint/eslintrc
```

---

## Step 3: Config at Root

Config files live at **project root** (standard practice).

This project has the following files at root:

| File at root                           | Purpose                                |
| -------------------------------------- | -------------------------------------- |
| `.prettierrc`                          | Prettier                               |
| `.prettierignore`                      | Prettier ignore                        |
| `commitlint.config.cjs`                | Commitlint                             |
| `eslint.config.mjs`                    | ESLint (flat config + next + prettier) |
| `sonar-project.properties`             | SonarQube                              |
| `vitest.config.ts`                     | Vitest                                 |
| `vitest.setup.ts`                      | Vitest setup                           |
| `.cursorrules`                         | Cursor rules                           |
| `.cursor/rules/*.mdc`                  | Cursor rules by context                |
| `.github/workflows/ci.yml`             | GitHub Actions CI                      |
| `.docker/sonarqube/docker-compose.yml` | SonarQube Docker                       |

If creating a new project with `create-next-app` and then copying this project, copy the files above from this repo to the root of the new project.

---

## Step 4: Update package.json Scripts

Add or edit in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md,yml,yaml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md,yml,yaml}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --passWithNoTests",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "sonar": "npx dotenv-cli -- npx sonarqube-scanner",
    "db:generate": "prisma generate",
    "db:push": "npx dotenv-cli -e .env -- prisma db push",
    "db:seed": "npx dotenv-cli -e .env -- prisma db seed",
    "db:studio": "prisma studio",
    "lint-staged": "lint-staged",
    "prepare": "husky || true"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

---

## Step 5: Configure Husky

```bash
npx husky init
```

Create `.husky/commit-msg` manually (`husky add` is deprecated):

**Windows (PowerShell):**

```powershell
echo "npx --no -- commitlint --edit `$1" > .husky/commit-msg
```

**macOS / Linux:**

```bash
echo 'npx --no -- commitlint --edit $1' > .husky/commit-msg
```

Or create `.husky/commit-msg` and add this single line:

```
npx --no -- commitlint --edit $1
```

---

## Step 6: (Optional) Run SonarQube with Docker

```bash
cd .docker/sonarqube
docker compose up -d
```

Then create `.env` at root:

```
SONAR_TOKEN=your-token-from-sonarqube-ui
```

And run:

```bash
npm run sonar
```

**Note:** If you see "Missing blame information", it is expected when the repo has no commits yet or a shallow clone. The project sets `sonar.scm.disabled=true` so the scan still succeeds. To use blame/New Code in SonarQube, commit all files, then set `sonar.scm.disabled=false` (or remove that line) in `sonar-project.properties` and re-run the scan.

---

## Step 7: Verify Setup

```bash
npm run format:check
npm run lint
npm run type-check
npm run test:ci
npm run build
```

---

## Common Commands

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Run dev server                      |
| `npm run lint`        | Run ESLint                          |
| `npm run format`      | Format with Prettier                |
| `npm run test`        | Run unit tests                      |
| `npm run test:ci`     | Run tests with coverage (CI)        |
| `npm run test:e2e`    | Run E2E tests (Playwright)          |
| `npm run test:e2e:ui` | Run E2E tests with UI mode          |
| `npm run sonar`       | Run SonarQube scan (Sonar required) |

---

## Notes

- Config files live at project root.
- If `npx create-next-app` creates duplicate files, merge or replace as needed.
- SonarQube is optional but helps verify code quality.
