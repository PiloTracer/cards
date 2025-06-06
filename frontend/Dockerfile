# ─── build stage ─────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
RUN corepack enable

# 1. copy *only* manifest & lockfile first – enables layer caching
COPY frontend/pnpm-lock.yaml frontend/package.json ./

# 2. install deps inside the container
RUN pnpm install --frozen-lockfile

# 3. copy the rest of the source – this layer changes when you edit code
COPY frontend/ .

# 4. build Next.js (outputs .next/standalone)
RUN pnpm build

# ─── runtime stage ───────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/.next/standalone /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
