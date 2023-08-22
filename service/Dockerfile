FROM node:18
# Create app directory
WORKDIR /usr/app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
RUN yarn install
