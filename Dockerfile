FROM node:18.12.1 as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]


