# URL Shortener

A URL shortener built with **TanStack Start** (React + TanStack Router/Query), **Elysia** (API), **Drizzle ORM** (Turso/libSQL), and **better-auth** (Google + anonymous sessions).

## Features

- **Landing page**: auto-focused URL input that creates an **anonymous session on first type** (if not logged in).
- **Create short link**: submits to `api().links.post()` and redirects to `/dashboard`.
- **Dashboard**: lists all of your links, prefetched with TanStack Router + React Query, rendered with `useSuspenseQuery`.
- **Auth**: Google sign-in and anonymous sessions via `authClient` (better-auth).
- **UI**: shadcn components + Tailwind.

## Tech stack

- **Runtime**: Bun
- **Frontend**: React, TanStack Start, TanStack Router
- **Data**: TanStack Query
- **Backend**: Elysia (typed API via `@elysiajs/eden` treaty)
- **DB**: Drizzle ORM + Turso/libSQL (local.db supported)
- **Auth**: `better-auth` (Google + anonymous client plugin)

## Getting started

### 1) Install dependencies

```bash
bun install
```

### 2) Configure environment

Copy `.env.example` to `.env` and fill in the required values.

- **Turso DB**: `TURSO_DATABASE_URL="file:local.db"` and set `TURSO_AUTH_TOKEN=" "` for local development.
- **Auth**: `BETTER_AUTH_SECRET` is required.
- **Google OAuth**: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are required by the current env schema.

### 3) Run migrations

This project uses Drizzle migrations. Run them once before starting the dev server:

```bash
bun db migrate
```

### 4) Run the dev server

```bash
bun dev
```

The app runs on `http://localhost:3000`.

## How it works

### API client

All frontend → backend calls go through `src/lib/api.ts`:

- `api().links.get()` fetches the current user’s links
- `api().links.post({ body: { url } })` creates a short link

Query options live in `src/query/link.ts` (example: `getAllLinkOptions`), which is used for:

- **Route prefetch**: `queryClient.ensureQueryData(getAllLinkOptions)`
- **Suspense rendering**: `useSuspenseQuery(getAllLinkOptions)`

### Auth client

Auth calls go through `src/lib/auth-client.ts`:

- `authClient.useSession()` for reactive session state
- `authClient.signIn.anonymous()` for anonymous sessions
- `authClient.signIn.social({ provider: "google" })` for Google login

## Routes

- `/` (landing): `src/routes/_app/index.tsx`
  - Typing triggers anonymous login if needed.
  - Submit calls `api().links.post()` then navigates to `/dashboard`.
- `/dashboard`: `src/routes/_app/dashboard.tsx`
  - Prefetches `getAllLinkOptions` in `beforeLoad` and renders with suspense.

## Database & migrations

Drizzle is configured in `drizzle.config.ts` and uses `src/server/db/schema/index.ts` as the schema entrypoint.

Common commands:

```bash
# drizzle-kit wrapper
bun run db --help
```

Migrations are output to `./migrations`.

## Scripts

```bash
bun run dev       # start dev server (port 3000)
bun run build     # production build
bun run start     # run the built server

bun run lint
bun run format
bun run check     # format:check + lint + typecheck
bun run test
```
