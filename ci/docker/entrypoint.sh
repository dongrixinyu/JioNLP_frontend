#!/bin/sh
# entrypoint.sh — starts nginx in the foreground so Docker can track the process.
# Running nginx with -g "daemon off;" keeps it as PID 1, which means:
#   - Docker receives SIGTERM/SIGQUIT and can shut the container down cleanly.
#   - "docker stop" works correctly without a separate signal relay.

set -e

echo "[entrypoint] Testing nginx configuration..."
nginx -t

echo "[entrypoint] Starting nginx in foreground..."
exec nginx -g "daemon off;"


