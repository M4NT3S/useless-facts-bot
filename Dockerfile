FROM node:22-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN chown -R node:node /home/node/app

user node

COPY --chown=node:node . .

RUN chmod +x ./script/start.sh

CMD [ "./script/start.sh" ]