FROM node:14
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 4300
VOLUME [ "/usr/src/app" ]
ENTRYPOINT [ "yarn", "start" ]