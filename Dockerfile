# FROM oven/bun:1

# WORKDIR /app

# COPY package.json bun.lockb ./
# RUN bun install

# COPY . .
# RUN bun prisma generate

# EXPOSE 5000
# CMD ["bun", "run", "start"]


FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./

COPY prisma/ ./prisma/

RUN bun install

RUN bun prisma generate

COPY src/ .

RUN adduser --disabled-password --gecos "" appuser
USER appuser


CMD ["bun", "run", "src/server.ts"]