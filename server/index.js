const https = require('https');
const fs = require('fs');

require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const { ApolloServer, /* AuthenticationError */ } = require('apollo-server-express');

const { models, connectDb } = require('./models');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

const getMe = async req => {
  const token = req.headers['authorization'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.APP_SECRET);
    } catch (e) {
      return null;
    }
  }
};



connectDb().then(async () => {
  if (process.env.RESET_DB) {
    models.User.deleteMany({});
    const user1 = await models.User.create({
      username: 'sumittops',
      email: 'sumitthewildspirit@gmail.com',
      password: 'tymus29'
    });

    const user2 = await models.User.create({
      username: 'livesumit',
      email: 'sumit-majumdar@live.com',
      password: 'tymus29'
    });
    const user3 = await models.User.create({
      username: 'tymus',
      email: 'sumit25ish@gmail.com',
      password: 'tymus29'
    });
    await Promise.all([user1.save(), user2.save(), user3.save()]);
  }
  const app = express();
  const httpServer = https.createServer({
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    ca: fs.readFileSync(process.env.SSL_CA_PATH)
  }, app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    async context({ req }) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.APP_SECRET
      }
    }
  })
  apolloServer.installSubscriptionHandlers(httpServer);
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  
  const port = process.env.APP_PORT || 8000;
  const host = process.env.APP_HOST || 'localhost'
  // pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
  //   if (err) {
  //     throw err;
  httpServer.listen(port, host, 2, () => {
    console.log(`Server running on https://${host}:${port}/graphql`);
  });
  // })
}).catch((e) => {
  console.error(e);
  process.exit();
});


