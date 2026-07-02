# ─────────────────────────────────────────────
# Stage 1 — Build the Vue app
# ─────────────────────────────────────────────
FROM jionlp_online:v2.0 AS builder

WORKDIR /app


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
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]
