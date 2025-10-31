#!/usr/bin/env sh
set -e

echo "[entrypoint] Running database/ES seed..."
# Don't fail the container if seed encounters recoverable issues; log and continue
npm run seed || echo "[entrypoint] Seed encountered errors; continuing to start API"

echo "[entrypoint] Starting API server..."
exec npm run dev
