FROM node:24-bookworm-slim
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080 \
    NO_UPDATE_CHECK=1

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY serve.json ./
COPY --chown=node:node dist ./dist

USER node
EXPOSE 8080
CMD ["node", "node_modules/serve/build/main.js", "dist", "--config", "/app/serve.json", "--no-clipboard", "--no-port-switching"]
