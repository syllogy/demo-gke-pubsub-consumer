FROM node:14.7.0

WORKDIR /app
COPY server.js .
COPY consumer.js .
COPY package.json .
COPY package-lock.json .

RUN npm i

CMD ["npm", "run", "start"]
