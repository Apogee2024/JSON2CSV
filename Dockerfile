# Use Node.js v20.15.0 with Bullseye as the base image, linux mint
FROM node:20.15.0-bullseye-slim

# Set up the rest of the Dockerfile
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3010

CMD ["npm", "start"]
