# ─────────────────────────────────────────────
# Stage 1 — Build the Vue app
# ─────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies (prefer npm ci for reproducible builds)
RUN if [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    else \
      npm ci; \
    fi

# Copy the rest of the source
COPY . .

# Build for production
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — Serve with nginx (lean final image)
# ─────────────────────────────────────────────
FROM nginx:1.25-alpine AS runner

# Remove default nginx config and default html
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom nginx config
COPY ci/docker/nginx.conf /etc/nginx/nginx.conf

# Copy the entrypoint script
COPY ci/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose HTTP port (SSL is terminated by the host reverse proxy or Certbot outside)
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
