# === Build Stage ===
FROM oven/bun:1.0.25-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY bun.lockb package.json vite.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

# Install dependencies and build
RUN bun install --frozen-lockfile && \
    bun run build

# === Serve Stage ===
FROM alpine:3.19

# Install a simple HTTP server (e.g., lighttpd or http-server)
RUN apk add --no-cache lighttpd

# Copy build output
COPY --from=builder /app/dist /var/www/localhost/htdocs

# Copy a basic lighttpd config
RUN echo 'server.document-root = "/var/www/localhost/htdocs"\n\
server.port = 3000\n\
dir-listing.activate = "disable"\n' > /etc/lighttpd/lighttpd.conf

EXPOSE 3000

CMD ["lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
