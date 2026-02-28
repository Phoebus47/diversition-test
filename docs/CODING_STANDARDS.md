# Image Gallery SPA – Coding Standards & Best Practices

This document outlines coding standards and best practices for the Image Gallery SPA project.

### Section Index (for targeted reads)

| §   | Topic                                                                          |
| --- | ------------------------------------------------------------------------------ |
| 1   | Core Principles                                                                |
| 2   | React & Next.js (client vs server, components, hooks, images, layout, styling) |
| 3   | TypeScript                                                                     |
| 4   | Folder structure, component reuse, variants, barrel (index)                    |
| 5   | Performance (front & back)                                                     |
| 6   | Animation (optional – Framer Motion or CSS)                                    |
| 8   | SEO metadata, a11y (accessibility), Lighthouse                                 |
| 10  | ESLint, Prettier, file size & complexity                                       |
| 11  | Error handling                                                                 |
| 13  | Testing (quality, coverage)                                                    |
| 14  | Copy / UI text (constants, no hardcoding)                                      |
| 17  | SonarQube / code quality                                                       |
| 18  | Code quality checklist                                                         |

---

## 1. Core Principles

- **KISS (Keep It Simple, Stupid):** Avoid over-engineering. Write code that is easy to read and maintain.
- **DRY (Don't Repeat Yourself):** Extract repeated logic into functions, hooks, or components.
- **YAGNI (You Aren't Gonna Need It):** Don't implement features or abstractions "just in case." Build for current requirements.
- **Separation of Concerns:** Keep logic separate from presentation. Use hooks for logic and components for UI.

---

## 2. React & Next.js Best Practices

### Client vs server components

- **Default to server:** In the App Router, use server components by default for static content or data fetching.
- **Use `'use client'` when:** You need `useState`, `useEffect`, event handlers (`onClick`, `onChange`), browser APIs (`window`, `document`), or client-only libraries such as IntersectionObserver for infinite scroll.
- **Composition:** Keep page/layout as server and wrap only the interactive part in a client component.

```typescript
// Server component (default) – no 'use client'
const GalleryPage = async () => {
  const initialImages = await fetchImages(0, PAGE_SIZE);
  return <GalleryClient initialImages={initialImages} />;
};

// Client component – infinite scroll, filter state
'use client';
const GalleryClient = ({ initialImages }: Props) => {
  const [filter, setFilter] = useState<string | null>(null);
  return (/* ... */);
};
```

### Functional Components

- Use **Functional Components** with Hooks for all UI.
- **Naming:** PascalCase for components (e.g., `GalleryCard.tsx`, `ImageGrid.tsx`).

### Hooks Usage

- **`useState`:** For local UI state.
- **`useEffect`:** For side effects (e.g., infinite scroll, subscriptions).
- **`useCallback`:** When passing functions as props to memoized children.
- **`useMemo`:** For expensive calculations (e.g., filtering images by hashtag).
- **Custom Hooks:** Extract complex logic into custom hooks (e.g., `useInfiniteScroll`, `useGalleryFilter`).

### Navigation

- **`<Link>`:** Use `Link` from `next/link` for internal links.
- **Avoid:** `window.location.href` (causes full page reload).

### Images

- **Use Next.js `<Image>`:** Use `Image` from `next/image` for all images. Do not use raw `<img>`.
- **Placeholder:** For placehold.co placeholders, you can use `unoptimized` or direct `src`.
- **Alt text:** Always provide descriptive `alt` for a11y and SEO.

### Layout: Hybrid (full-width background, content in container)

- **Section outer:** `w-full` (and background classes).
- **Content inner:** `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` to center content with max-width.

```tsx
<section className="w-full bg-zinc-50 py-16">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* gallery grid, cards, etc. */}
  </div>
</section>
```

### Styling Best Practices

- **No Inline Styles:** Do not use `style={{ ... }}`. Use Tailwind CSS utility classes.
- **No Hardcoded Colors:** Do not hardcode colors (e.g., `#E53935`, `rgb(...)`). Use CSS variables or Tailwind semantic classes from `globals.css`.
- **Design tokens:** Use colors and shadows from `src/app/globals.css`. Add new tokens in `:root` when needed.
- **Dynamic Styles:** Use `cn()` (clsx + tailwind-merge) for conditional classes.
- **Arbitrary Values:** Avoid arbitrary values (`w-[123px]`). Prefer standard utilities.

### Interactive component states

For **buttons, links, and interactive elements**, support these states:

| State             | Tailwind / HTML                                                                     |
| ----------------- | ----------------------------------------------------------------------------------- |
| **Default**       | Base classes                                                                        |
| **Hover**         | `hover:` (e.g., `hover:bg-white/20`, `hover:text-brand-accent`)                     |
| **Active**        | `active:` (e.g., `active:scale-[0.98]`)                                             |
| **Disabled**      | `disabled` + `disabled:` (e.g., `disabled:opacity-50 disabled:pointer-events-none`) |
| **Focus-visible** | `focus-visible:` (e.g., `focus-visible:outline focus-visible:ring-2`)               |

---

## 3. TypeScript Guidelines

- **Strict Mode:** Enable `strict` in `tsconfig.json`.
- **No `any`:** Avoid `any`. Use `unknown` or define interface/type.
- **Interfaces vs Types:** Use `interface` for object definitions, `type` for unions.
- **Props:** Define interfaces for all component props.
- **Avoid Magic Numbers/Strings:** Use named constants instead of magic values.

```typescript
interface GalleryCardProps {
  image: ImageItem;
  hashtags: string[];
  onHashtagClick: (tag: string) => void;
}
```

### Comments

- Use comments only when necessary.
- Do not commit `console.log` or debug code.
- Do not commit commented-out code.

---

## 4. Folder Structure, Component Reuse & Barrel (index)

### Folder structure

```
src/
├── app/                    # App Router
│   ├── page.tsx           # Home page (Gallery)
│   ├── layout.tsx
│   ├── globals.css
│   └── api/               # API routes (if any)
├── components/            # Shared components
│   ├── GalleryCard.tsx
│   ├── ImageGrid.tsx
│   ├── HashtagFilter.tsx
│   └── ui/                # UI primitives
├── lib/                   # Utils, hooks, data
│   ├── utils.ts
│   ├── constants.ts
│   ├── hooks/
│   │   ├── use-infinite-scroll.ts
│   │   └── use-gallery-filter.ts
│   └── data/
│       └── mock-images.ts

__tests__/                 # Test files
```

- **Page-specific components:** Place under `src/app/.../components/` when used only by that route.
- **Shared components:** Place under `src/components/` or `src/components/ui/`.
- **Hooks, utils:** Place under `src/lib/`.

### Component reuse & variants

- **Reuse:** Extract repeated UI into shared components.
- **Variants:** Use a single component with a `variant` prop instead of multiple similar files.
- **Composition:** Keep files under 300 lines.

### Naming Conventions

| Type                      | Case                     | Example                                    |
| ------------------------- | ------------------------ | ------------------------------------------ |
| **Component files**       | PascalCase               | `GalleryCard.tsx`, `ImageGrid.tsx`         |
| **Utils, hooks, lib**     | kebab-case               | `use-infinite-scroll.ts`, `mock-images.ts` |
| **Route segments**        | kebab-case               | `api/images/`                              |
| **Test files**            | same as source + `.test` | `GalleryCard.test.tsx`                     |
| **Functions / variables** | camelCase                | `fetchImages`, `isLoading`                 |
| **Constants**             | UPPER_SNAKE_CASE         | `PAGE_SIZE`, `INITIAL_LOAD_COUNT`          |

---

## 5. Performance (front & back)

### Front-end performance

- **Server by default:** Use server components as much as possible.
- **Images:** Use `next/image`. Add `priority` for above-the-fold images.
- **LCP / CLS:** Set dimensions or aspect ratio for images.
- **Infinite scroll:** Use IntersectionObserver efficiently.

### Back-end / API performance

- **Response time:** Keep API routes fast.
- **Validation:** Validate input early. Return 400 for invalid payloads.

---

## 6. Animation (optional)

- For animations, use **Framer Motion** or **CSS transitions**.
- Use shared variants in `src/lib/motion.ts` if present.
- Avoid magic numbers for duration/delay.

---

## 8. SEO Metadata, Accessibility (a11y) & Lighthouse

### SEO metadata

- Use `generateMetadata` or `metadata` export in `layout.tsx` or `page.tsx`.
- Set `title` and `description` for all public pages.
- Add `openGraph` for social sharing.

### Accessibility (a11y)

- **Semantic HTML:** Use correct tags (`<button>`, `<a>`, `<main>`, `<nav>`, `<section>`).
- **ARIA:** Add `aria-label` for icon-only buttons.
- **Images:** Provide descriptive `alt`.
- **Keyboard:** Support Tab/Enter/Space and `focus-visible`.

### Lighthouse

- **Target:** Performance ≥90, Accessibility 100, Best Practices 100, SEO 100.
- **Core Web Vitals:** LCP < 2.5s, CLS < 0.1.

---

## 10. Code Formatting & Tooling

### Prettier

- Config in `.prettierrc`.
- Run `npm run format` before commit.

### ESLint

- Config in `eslint.config.mjs`.
- Run `npm run lint` and `npm run lint:fix`.
- Fix all warnings before merge.

### File Size & Complexity

- **File Size:** Keep files under **300 lines**.
- **Function:** Keep under **50 lines**.
- **Component:** Keep under **200 lines**.

---

## 11. Error Handling

- **API Calls:** Use `try-catch` in logic or custom hooks.
- **UI Feedback:** Show error messages or loading state to users.
- **Logging:** Avoid `console.error` in production code.

---

## 13. Testing (quality & coverage)

### Testing stack

- **Unit tests:** Vitest + React Testing Library (RTL).

### Test file conventions

- **Naming:** `*.test.ts` or `*.test.tsx`. Place in `__tests__/` or next to source.
- **Behavior over implementation:** Assert outcomes, not implementation details.
- **Queries:** Use `getByRole`, `getByLabelText` over `getByTestId`.
- **Mocks:** Mock `next/image`, IntersectionObserver, fetch in tests.

---

## 14. Copy / UI Text (no hardcoding)

- **Do not hardcode** UI text in components.
- Use **constants** or **config** in `src/lib/constants.ts` for repeated text.
- If the project expands to i18n, add next-intl and `messages/*.json` later.

```typescript
// ✅ Good
const LABELS = {
  loadMore: 'Load more',
  noResults: 'No images match this filter',
} as const;

// ❌ Avoid
<p>No images match this filter</p>
```

---

## 17. SonarQube / Code Quality

- Run `npm run sonar` (when SonarQube server is running).
- **Front-end:** Use types, no `any`, a11y, design tokens.
- **Back-end:** Validate input, use correct status codes.
- **Tests:** Test behavior, mock external deps.
- **No dead code:** Remove unused variables, functions, imports.
- **No console.log:** Remove before commit.

---

## 18. Code Quality Checklist

Before commit, verify:

- [ ] TypeScript compilation passes
- [ ] ESLint passes with no warnings
- [ ] Prettier formatting applied
- [ ] SonarQube passes (if run)
- [ ] Images have `alt`
- [ ] No hardcoded colors; use design tokens
- [ ] No hardcoded UI text; use constants
- [ ] Files under 300 lines
- [ ] No `console.log` or debug code
- [ ] Interactive elements have hover, focus-visible
- [ ] Components are properly typed
- [ ] Server by default; `'use client'` only when needed

---

**Document Version:** 1.0  
**Last Updated:** February 28, 2026  
**Project:** Image Gallery SPA
