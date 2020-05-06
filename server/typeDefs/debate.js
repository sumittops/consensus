const { gql } = require('apollo-server-express');

module.exports =  gql `
    type Debate {
        id: ID!
        title: String!
        description: String
        forParticipant: User!
        againstParticipant: User!
    }
    extend type Query {
        debates: [Debate]!
        debate(id: ID!) : Debate
    }

    extend type Mutation {
        userConnected(userId: ID!, debateId: ID!): Int!
        userDisconnected(userId: ID!, debateId: ID!): Int!
    }

`