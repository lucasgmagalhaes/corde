FROM node:alpine

WORKDIR /usr/yourapplication-name

COPY package.json .

RUN npm install

COPY . .

RUN tsc

CMD ["npm", "run" "bot"]