FROM harbor-registry.lienvietpostbank.com.vn:5443/uniform/uniform_web_deploy:v2 as builder
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY . /app
RUN ls /app
RUN ng build --source-map=false
#RUN ng build --prod --output-hashing=all

FROM harbor-registry.lienvietpostbank.com.vn:5443/uniform/nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /var/www/uniform-web/*
COPY --from=builder /app/dist/smart-form /var/www/uniform-web
EXPOSE 80
CMD ["/bin/sh",  "-c",  "envsubst < /var/www/uniform-web/assets/env.template.js > /var/www/uniform-web/assets/env.js && exec nginx -g 'daemon off;'"]
