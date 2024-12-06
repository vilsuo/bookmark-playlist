FROM node:20.11

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install --loglevel verbose

COPY . .

#CMD ["npm", "run", "dev"]