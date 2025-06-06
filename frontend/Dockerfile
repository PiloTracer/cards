# ───── build stage ─────────────────────────────────────────
FROM node:18-slim AS builder
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
RUN corepack enable
COPY frontend ./
RUN pnpm install --frozen-lockfile \
 && pnpm build   # Next.js `out` dir

# ───── runtime stage ───────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/.next/standalone /usr/share/nginx/html
# Next.js standalone already has required files
CMD ["nginx", "-g", "daemon off;"]
