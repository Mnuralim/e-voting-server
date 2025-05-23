
FROM oven/bun:latest

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package.json bun.lockb ./

COPY prisma/ ./prisma/

RUN bun install

RUN bun prisma generate

COPY src/ .

RUN adduser --disabled-password --gecos "" appuser
USER appuser


CMD ["bun", "run", "src/server.ts"]