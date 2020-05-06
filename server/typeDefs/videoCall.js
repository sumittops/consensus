const { gql } = require('apollo-server-express');

module.exports = gql `
    extend type Subscription {
        userCalled: ActiveCall
        callAccepted: ActiveCall
        callEnded: Boolean
    }

    extend type Mutation {
        makeCall(debateId: ID!, callerId: ID!, calleeId: ID!, offer: RTCOfferInput!): Boolean!
        endCall(debateId: ID!): Boolean!
        acceptCall(debateId: ID!, offer: RTCOfferInput!): Boolean!
    }

    extend type Query {
        onlineUsers(debateId: ID!): [User]!
    }

    type ActiveCall {
        callerId: String
        calleeId: String
        callerOffer: RTCOffer 
        calleeOffer: RTCOffer
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