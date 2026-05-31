FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/theme/package.json packages/theme/package.json
COPY packages/visualization/package.json packages/visualization/package.json
COPY packages/axios/package.json packages/axios/package.json
COPY packages/color/package.json packages/color/package.json
COPY packages/utils/package.json packages/utils/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter @sa/web build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.output apps/web/.output
EXPOSE 3000
CMD ["node", "apps/web/.output/server/index.mjs"]
