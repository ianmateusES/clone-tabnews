FROM node:22-alpine3.19

USER node

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD [ "npm", "run", "dev" ]
