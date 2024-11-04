ARG NODE_VERSION=22

# DEVELOPMENT
FROM node:${NODE_VERSION}-alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "start:dev" ]

# PRODUCTION
FROM node:${NODE_VERSION}-alpine as production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
