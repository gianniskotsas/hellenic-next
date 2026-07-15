# Node/container build of hellenic-next (Next.js 15 + Payload CMS 3).
# Re-platformed off Cloudflare Workers: D1 -> Node SQLite, R2 -> S3 API.
FROM node:22-bookworm-slim AS base
# Pin pnpm to a version the repo supports (engines.pnpm = ^9 || ^10)
RUN npm install -g pnpm@10
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install --no-frozen-lockfile

# ---- builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time only placeholders so the Payload config loads (no DB/S3 connection at build).
ENV PAYLOAD_SECRET=build-only-secret
ENV DATABASE_URI=file:/tmp/build.db
RUN pnpm run build:node

# ---- runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
# Source + config needed so the Payload CLI can run migrations at boot.
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
# Point the Payload CLI at the config explicitly.
ENV PAYLOAD_CONFIG_PATH=/app/src/payload.config.ts
ENV NODE_OPTIONS=--no-deprecation
# Persistent volume mount point for the SQLite database.
RUN mkdir -p /data
EXPOSE 3000
# Self-baseline (if needed) -> payload migrate -> next start (migrate is non-fatal).
CMD ["sh", "scripts/start-prod.sh"]
