FROM node:14
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm i
COPY . .
EXPOSE 4200
VOLUME [ "/usr/src/app" ]
ENTRYPOINT [ "npm", "start" ]