FROM node:22.1.0-alpine

WORKDIR /EWPROJ/frontend

COPY package.json .package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
