FROM node:18.12.1 as builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY . .
RUN yarn build

FROM node:slim as runner
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# COPY package.json yarn.lock ./
# RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist
# EXPOSE 8080
CMD [ "node", "dist/server.js" ]