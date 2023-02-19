FROM node:16

RUN apt-get update -y
RUN apt-get install curl -y

RUN npm install -g nodemon

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY swagger.json .
COPY . .

ENV NODE_OPTIONS="--max_old_space_size=8192"

EXPOSE 4000

# Start the Node.js server
CMD [ "npm", "run", "start" ]