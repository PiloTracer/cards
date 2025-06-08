########################  deps  #################################
FROM node:20-alpine AS deps
WORKDIR /app

# ── tell pnpm where to put global binaries and make sure it's on PATH
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
 && pnpm config set store-dir ${PNPM_HOME}/store --global

# copy manifest files **from repository root**
COPY frontend/package.json ./
RUN pnpm install

########################  runtime  ##############################
FROM node:20-alpine
WORKDIR /app

# same PNPM / PATH setup
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"

RUN corepack enable \
 && pnpm config set store-dir ${PNPM_HOME}/store --global

# bring cached node_modules
COPY --from=deps /app/node_modules ./node_modules
# bring source (will be bind-mounted during dev, but initial copy is handy)
COPY frontend/ .

EXPOSE 3000
CMD ["pnpm", "dev", "--port", "3000"]
