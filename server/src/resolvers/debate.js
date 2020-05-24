const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('./authorization');


const debateResolver = {
    Query: {
        debates: async (parent, args, { models }) => {
            const data = await models.Debate.find();
            return data;
        },
        debate: async (parent, { id }, { models }) => {
            const debate = await models.Debate.findById(id);
            return debate;
        }
    },
    Mutation: {
        userConnected: async (parent, { userId, debateId }, { models }) => {
            const userIds = await models.VideoCall.addOnlineUser(debateId, userId);
            return userIds.length;
        },
        userDisconnected: async (parent, { userId, debateId }, { models }) => {
            const userIds = await models.VideoCall.removeOnlineUser(debateId, userId);
            return userIds.length;
        },
        createDebate: combineResolvers(
            isAuthenticated,
            async (_, { title, description, forParticipant, againstParticipant }, { models }) => {
               const debate = await  models.Debate.create({
                    title,
                    description,
                    forParticipant,
                    againstParticipant
               });
               return debate;
            }
        )
    },
    Debate: {
        forParticipant: async (debate, _, { models }) => {
            return await models.User.findOne(
                debate.forParticipant
            );
        },
        againstParticipant: async (debate, _, { models }) => {
            return await models.User.findOne(
                debate.againstParticipant
            );
        }
    }
}

module.exports = debateResolver;