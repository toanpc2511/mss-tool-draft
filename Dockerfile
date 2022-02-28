FROM node:16-alpine as node
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build-prod

FROM nginx:alpine
COPY --from=node /app/dist/sun-oil-admin /usr/share/nginx/html
EXPOSE 80