### deps stage – install once, cache forever
FROM node:20-alpine AS deps
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
RUN corepack enable

# copy only manifest/lockfile for layer-caching
COPY frontend/pnpm-lock.yaml frontend/package.json ./
RUN pnpm install --frozen-lockfile

### dev stage – hot-reload with pnpm dev
FROM node:20-alpine
WORKDIR /app
ENV PNPM_HOME=/usr/local/share/pnpm
RUN corepack enable

# copy node_modules from cached deps stage
COPY --from=deps /app/node_modules ./node_modules

# source code will be mounted from host, but we need an initial copy
COPY frontend/ .

EXPOSE 3000
CMD ["pnpm", "dev", "--port", "3000"]
