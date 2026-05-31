# SoybeanAdmin Agent Instructions

## Engineering Priorities

Architecture is the expensive part. Preserve a coherent final system design before reducing scope. Keep changes focused, avoid speculative abstractions, and make every changed line trace to the TanStack refactor.

## Stack

- Package manager: pnpm only.
- Web app: TanStack Start, React, TypeScript, Tailwind CSS v4, shadcn/ui source-style components, Lucide, TanStack Router, Query, Table, and Form.
- Mobile app: Expo Router with React Native primitives and shared domain/API packages.
- Visualization: Three.js for the `/visualization/data-screen` route only. Keep WebGL lazy-loaded and separate from the admin shell.
- Deployment: Dokploy Node SSR. The production process runs the TanStack Start Nitro output.

## Repository Boundaries

- `apps/web` owns the browser/admin SSR experience.
- `apps/mobile` owns the Expo native experience.
- `packages/domain` owns route, auth, menu, and permission types/helpers.
- `packages/api` owns Apifox-compatible transport contracts and mock-safe client helpers.
- `packages/theme` owns design tokens shared by web and mobile.
- `packages/visualization` owns the data-screen scene contract and normalization.
- Existing Vue source is legacy and must not be imported by new code.

## Style Rules

- Do not use prohibited Chinese internet-company jargon.
- Keep Chinese UI copy concise and operational.
- Prefer direct, maintainable code over clever abstractions.
- Use shadcn composition patterns for web UI. Use semantic CSS variables and Tailwind v4 utilities.
- Use Expo native components and inline styles for mobile UI. Do not use DOM elements in Expo routes.

## Verification

- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` before handing off when feasible.
- For visual changes, verify the web app in Browser/IAB and compare against the approved concept image.
- For Expo changes, try Expo Go first.
