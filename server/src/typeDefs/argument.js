const { gql } = require('apollo-server-express');

module.exports =  gql `
    type Argument {
        statement: String!
        counterBy: Argument
    }
`