# Product Requirements Document (PRD): Image Gallery SPA

**Deadline:** Per test instructions (e.g. March 1, 2026, 8:00 PM)  
**Submission:** To the email and channel specified in the test instructions

---

## 1. Project Overview

| Item          | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
| **Objective** | Design architecture and develop a Single-Page Application (SPA) for an image gallery |
| **Scope**     | Image gallery with infinite scroll and keyword filtering                             |
| **Stack**     | Next.js (React), Node.js, MySQL, Docker, Ubuntu Server                               |

---

## 2. Core Features

### 2.1 Gallery Display

- Web page displays images with **hashtags** (keywords) for each image

### 2.2 Infinite Scroll / Lazy Loading

- Display a limited number of images initially (e.g., 12–20 images)
- When scrolling down, automatically load more images

### 2.3 Dynamic Image Attributes

- Support images of varying sizes (masonry / responsive grid)

### 2.4 Unlimited Hashtags

- Each image can have an unlimited number of keywords

### 2.5 Keyword Filtering

- Clicking a hashtag filters the gallery to show only images with that keyword

---

## 3. Data & Mockup

| Item         | Approach                                                   |
| ------------ | ---------------------------------------------------------- |
| **Images**   | Use placeholders from [placehold.co](https://placehold.co) |
| **Hashtags** | Generate mock keywords (no need to match image content)    |
| **Goal**     | Mock data should facilitate easy testing and evaluation    |

---

## 4. UI/UX Design

- **Layout:** Free to design; no need to follow a specific example
- **Styling:** Full freedom to style and showcase UI skills

---

## 5. Technical Requirements

| Item              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| **Stack**         | No restriction; use languages appropriate for the role |
| **Framework**     | Framework usage will be considered favorably           |
| **Architecture**  | Specify architecture and technologies for Production   |
| **System Specs**  | Server specifications, OS/software, deployment method  |
| **Documentation** | Diagram explaining architecture is recommended         |

---

## 6. Deliverables

### 6.1 Required

| Item            | Description                                |
| --------------- | ------------------------------------------ |
| **Source Code** | Submit all source code used in development |
| **Format**      | If compressed, use **.zip only** (no .rar) |
| **Channel**     | As specified in the test instructions      |

### 6.2 Optional (Recommended)

| Item         | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| **Live URL** | Include deployed URL for live testing (see PROJECT_STATUS.md) |

### 6.3 Deployment

- **Not required** to deploy per assignment; this project is deployed on Vercel.
- Live URL is documented in [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md).

---

## 7. Recommended Tech Stack

| Layer          | Technology                           | Notes                    |
| -------------- | ------------------------------------ | ------------------------ |
| Frontend       | Next.js (React)                      | Modern framework         |
| Backend        | Node.js (API Routes / Express)       | Server-side logic        |
| Database       | MySQL + Prisma                       | Image and hashtag data   |
| Infrastructure | Docker & Docker Compose              | Containerization         |
| Deployment     | Vercel (live); Docker / Ubuntu + PM2 | Production / self-host   |
| CI/CD          | GitHub Actions                       | Automated quality checks |

---

## 8. Quality Gates

- **ESLint** – Code linting
- **Prettier** – Code formatting
- **SonarQube** – Code quality, bugs, vulnerabilities
- **Husky + Commitlint** – Commit message format
- **Vitest** – Unit/Integration tests
- **GitHub Actions** – CI pipeline

---

> **Status:** See [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) for full project status.
