# Dev/check image only — not used for deployment (Vercel builds from source).
FROM node:24-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Pre-create volume mount points owned by the non-root user so the
# named volumes inherit that ownership on first creation.
RUN mkdir -p /app/node_modules /app/.next && chown -R node:node /app
USER node
