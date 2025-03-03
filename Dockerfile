FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun prisma generate

EXPOSE 5000
CMD ["bun", "run", "start"]