FROM node:16-alpine as node
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build-prod

FROM nginx:alpine
COPY --from=node /app/dist/sun-oil-admin /usr/share/nginx/html
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80