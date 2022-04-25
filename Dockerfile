FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install rimraf 

RUN npm install

COPY . .

RUN npm run build

FROM node:12.19.0-alpine3.9 as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --from=development /usr/src/app/dist ./dist/

CMD ["node", "dist/src/main.js"]