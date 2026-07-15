#!/bin/sh
# Production entrypoint: self-baseline (if needed) -> run migrations -> start.
#
# Migration failures are logged but NON-FATAL: the app still starts on the
# existing (already-correct) database, so a migration hiccup can never take the
# live site down. A fresh database will be built by `payload migrate`.
set -u

echo "[start-prod] baseline check..."
node scripts/prestart-migrate.mjs || echo "[start-prod] baseline script errored (continuing)"

echo "[start-prod] running payload migrate..."
if node_modules/.bin/payload migrate; then
  echo "[start-prod] migrations up to date"
else
  echo "[start-prod] payload migrate failed -- starting app anyway (DB assumed current)"
fi

echo "[start-prod] starting Next.js..."
exec node_modules/.bin/next start -p "${PORT:-3000}" -H "${HOSTNAME:-0.0.0.0}"
