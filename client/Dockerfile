FROM node

WORKDIR /client

COPY . /client/

RUN npm install

EXPOSE 9000
CMD ["npm", "run", "start:dev"]
