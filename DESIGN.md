# SoybeanAdmin TanStack Design

## Goal

Replace the Vue3/Vite/Pinia/NaiveUI/UnoCSS admin shell with a TanStack Start + React system while preserving SoybeanAdmin's core product model: authenticated admin workspace, dynamic menus, route permissions, tabbed navigation, theme controls, dashboard analytics, forms, tables, and mobile access.

## Visual Direction

The accepted visual reference is:

`/Users/a55/.codex/generated_images/019e7e70-dcab-7251-8996-a88977a8d36e/ig_0403d9b4a1f4aff7016a1c46d726808199b7e420ff9ee31cdb.png`

Design tokens:

- Background: `#f7f9fc`
- Surface: `#ffffff`
- Text: `#111827`
- Muted text: `#6b7280`
- Border: `#e5e7eb`
- Primary: `#646cff`
- Success: `#16a34a`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Radius: `6px`
- Shell density: compact desktop SaaS admin, not a landing page.

## Architecture

The repository is a pnpm monorepo:

- `apps/web`: TanStack Start SSR web app.
- `apps/mobile`: Expo Router native app.
- `packages/domain`: shared auth, route, menu, and permission domain model.
- `packages/api`: shared transport helpers and Apifox-compatible request contracts.
- `packages/theme`: shared design tokens.
- `packages/visualization`: Three.js data-screen contract and helpers.

The web app uses server functions for auth-sensitive calls. Access and refresh tokens are stored in HTTP-only cookies. The mobile app stores tokens in Expo SecureStore and calls the same API contract.

## Data Flow

1. Login uses `/auth/login` through the shared API helper.
2. Web login writes the session cookie on the server.
3. Mobile login writes the same `AuthSession` shape into SecureStore.
4. Menu routes come from Apifox when available, with local fallback routes for development.
5. Dynamic route component strings are mapped to React/Expo screens through a `componentKey` layer.
6. Unknown demo route components render `RouteWorkbench` so menu and permission behavior remains testable.

## WebGL Data Screen

The `/visualization/data-screen` route renders a Three.js scene lazily. Nodes represent services or domains. Edges represent aggregate traffic flow. Particles represent aggregate flow intensity only; they do not represent individual users or requests. The route provides reset view, status filters, selected-node detail, reduced-motion fallback, and a static summary.

## Deployment

Dokploy runs the web app as a Node SSR service:

```bash
pnpm install --frozen-lockfile
pnpm --filter @sa/web build
node apps/web/.output/server/index.mjs
```

The health endpoint is `/api/health`.
