FROM node:16

WORKDIR /usr/src/galasaui
COPY package*.json ./

RUN npm ci --omit=dev --force

COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]