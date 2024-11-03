ARG NODE_VERSION=22

# DEVELOPMENT
FROM node:${NODE_VERSION}-alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "npm", "run", "start:dev" ]

# PRODUCTION
FROM node:${NODE_VERSION}-alpine as production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]
