FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm i --force
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i -
COPY --from=builder /app/dist ./dist
EXPOSE 80
CMD ["node", "dist/server.js"]