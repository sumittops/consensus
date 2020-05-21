const { GraphQLDateTime } = require('graphql-iso-date');
const userResolvers = require('./user');
const debateResolver = require('./debate');
const videoCallResolver = require('./videoCall')

const customScalarResolver = {
    Date: GraphQLDateTime,
};



module.exports = [
    customScalarResolver,
    userResolvers,
    debateResolver,
    videoCallResolver
];