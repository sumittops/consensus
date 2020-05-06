const { gql } = require('apollo-server-express');

const debateSchema = require('./debate');
const argumentSchema = require('./argument');
const userSchema = require('./user');
const videoCallSchema = require('./videoCall')

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;



module.exports = [linkSchema, argumentSchema, debateSchema, userSchema, videoCallSchema];