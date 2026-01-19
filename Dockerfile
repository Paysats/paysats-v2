FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json* ./

# Copy workspace package.json files
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install dependencies (including devDependencies for building)
RUN npm install

# copy source code for server and shared
COPY server ./server
COPY shared ./shared

RUN npm run build:server

# stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Copy node_modules from builder (includes production deps)
COPY --from=builder /app/node_modules ./node_modules

# copy built server artifacts
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/package.json

COPY --from=builder /app/shared ./shared

# Expose port
EXPOSE 8000

# Start the server
CMD ["node", "server/dist/app.js"]
