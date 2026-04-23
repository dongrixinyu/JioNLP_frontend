#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
#  start_frontend.sh — Build and run the JioNLP frontend container
#
#  Usage:
#    ./start_frontend.sh              # build + run with defaults
#    ./start_frontend.sh --port 8080  # expose on a custom host port
#    ./start_frontend.sh --no-cache   # force a clean image rebuild
#    ./start_frontend.sh --stop       # stop and remove the running container
#    ./start_frontend.sh --help       # show this help
#
#  After the container starts, the frontend is reachable at:
#    http://localhost:<HOST_PORT>
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Configuration (override via flags below) ────────────────────────────────
IMAGE_NAME="jionlp-frontend"
IMAGE_TAG="latest"
CONTAINER_NAME="jionlp-frontend"
HOST_PORT=80          # port exposed on the host machine
CONTAINER_PORT=80     # port nginx listens on inside the container
NO_CACHE=false

# ── Resolve project root (the dir containing this script) ───────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKERFILE="$SCRIPT_DIR/ci/docker/Dockerfile"
DOCKERIGNORE_SRC="$SCRIPT_DIR/ci/docker/.dockerignore"
DOCKERIGNORE_DST="$SCRIPT_DIR/.dockerignore"

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ── Argument parsing ─────────────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --port)
      HOST_PORT="${2:?--port requires a value}"; shift 2 ;;
    --no-cache)
      NO_CACHE=true; shift ;;
    --stop)
      info "Stopping container '$CONTAINER_NAME' ..."
      docker stop "$CONTAINER_NAME" 2>/dev/null && docker rm "$CONTAINER_NAME" 2>/dev/null \
        && info "Container stopped and removed." \
        || warn "Container '$CONTAINER_NAME' was not running."
      exit 0 ;;
    --help|-h)
      sed -n '/^# ═/,/^# ═/p' "$0"
      exit 0 ;;
    *)
      error "Unknown argument: $1. Run with --help for usage." ;;
  esac
done

# ── Sanity checks ────────────────────────────────────────────────────────────
command -v docker &>/dev/null || error "Docker is not installed or not in PATH."
docker info &>/dev/null       || error "Docker daemon is not running."
[[ -f "$DOCKERFILE" ]]        || error "Dockerfile not found at: $DOCKERFILE"

# ── Copy .dockerignore to repo root so Docker build context picks it up ──────
if [[ -f "$DOCKERIGNORE_SRC" ]]; then
  cp "$DOCKERIGNORE_SRC" "$DOCKERIGNORE_DST"
  info "Copied .dockerignore to repo root."
fi

# ── Stop and remove any existing container ────────────────────────────────────
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  info "Removing existing container '$CONTAINER_NAME' ..."
  docker stop "$CONTAINER_NAME" &>/dev/null || true
  docker rm   "$CONTAINER_NAME" &>/dev/null || true
fi

# ── Build the Docker image ────────────────────────────────────────────────────
info "Building image '${IMAGE_NAME}:${IMAGE_TAG}' ..."
info "  Dockerfile : $DOCKERFILE"
info "  Build context: $SCRIPT_DIR"

BUILD_ARGS=(
  --file    "$DOCKERFILE"
  --tag     "${IMAGE_NAME}:${IMAGE_TAG}"
)

if [[ "$NO_CACHE" == true ]]; then
  BUILD_ARGS+=(--no-cache)
  warn "Building without cache (--no-cache)."
fi

docker build "${BUILD_ARGS[@]}" "$SCRIPT_DIR"

info "Image built successfully: ${IMAGE_NAME}:${IMAGE_TAG}"

# ── Run the container ─────────────────────────────────────────────────────────
info "Starting container '$CONTAINER_NAME' ..."
info "  Host port  : $HOST_PORT → container port $CONTAINER_PORT"
info "  Backend proxy: host.docker.internal:16666"

docker run \
  --detach \
  --name    "$CONTAINER_NAME" \
  --publish "${HOST_PORT}:${CONTAINER_PORT}" \
  --add-host host.docker.internal:host-gateway \
  --restart unless-stopped \
  "${IMAGE_NAME}:${IMAGE_TAG}"

# ── Health check ──────────────────────────────────────────────────────────────
info "Waiting for nginx to become ready ..."
for i in $(seq 1 10); do
  if docker exec "$CONTAINER_NAME" nginx -t &>/dev/null; then
    break
  fi
  sleep 1
done

CONTAINER_STATUS="$(docker inspect -f '{{.State.Status}}' "$CONTAINER_NAME")"
if [[ "$CONTAINER_STATUS" == "running" ]]; then
  info "Container is running."
  echo ""
  echo -e "  ${GREEN}Frontend available at:${NC} http://localhost:${HOST_PORT}"
  echo ""
  echo "  Useful commands:"
  echo "    View logs    : docker logs -f $CONTAINER_NAME"
  echo "    Open shell   : docker exec -it $CONTAINER_NAME sh"
  echo "    Stop         : ./start_frontend.sh --stop"
  echo ""
else
  error "Container failed to start. Check logs: docker logs $CONTAINER_NAME"
fi


