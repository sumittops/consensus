const { gql } = require('apollo-server-express');

module.exports = gql `
    extend type Subscription {
        userCalled: ActiveCall
        callAccepted: ActiveCall
        callEnded: Boolean
    }

    extend type Mutation {
        makeCall(debateId: ID!, from: ID!, to: ID!, offer: RTCOfferInput!): Boolean!
        endCall(debateId: ID!): Boolean!
        acceptCall(debateId: ID!, offer: RTCOfferInput!): Boolean!
    }

    extend type Query {
        onlineUsers(debateId: ID!): [User]!
    }

    type ActiveCall {
        from: String
        to: String
        offer: RTCOffer 
        answer: RTCOffer
    }

    input RTCOfferInput {
        sdp: String
        type: String
    }

    type RTCOffer {
        sdp: String
        type: String
    }

`