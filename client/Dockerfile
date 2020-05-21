FROM node

WORKDIR /client

COPY package*.json /client/

RUN npm install

COPY . /client/

EXPOSE 9000
CMD ["npm", "run", "start:dev"]
