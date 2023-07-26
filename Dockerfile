FROM node:16

WORKDIR /cafe-manager-backend

ENV NODE_OPTIONS=--max_old_space_size=4096

COPY package.json ./
RUN npm install

RUN npm run migrate
RUN npm run seed

COPY nodemon.json ./
COPY src ./src

CMD [ "npm", "start" ]