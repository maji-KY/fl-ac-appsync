FROM node:14-buster-slim AS deps

WORKDIR /app
COPY package.json yarn.lock .yarnclean .npmrc ./
RUN yarn install --frozen-lockfile


FROM node:14-buster-slim AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build


FROM node:14-buster-slim AS prod-deps

WORKDIR /app
COPY package.json yarn.lock .yarnclean .npmrc ./
RUN yarn install --production --frozen-lockfile


FROM gcr.io/distroless/nodejs:14 AS runner

WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --chown=nonroot:nonroot --from=builder /app/.next ./.next
COPY --from=prod-deps /app/node_modules ./node_modules

USER nonroot

EXPOSE 8080

CMD ["./node_modules/next/dist/bin/next", "start", "-p", "8080"]
