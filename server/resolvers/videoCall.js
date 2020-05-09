const { PubSub, withFilter } = require('apollo-server-express');
const { combineResolvers } = require('graphql-resolvers');
const { Types } = require('mongoose');
const { isAuthenticated } = require('./authorization');


const USER_CALLED = 'USER_CALLED'
const CALL_ACCEPTED = 'CALL_ACCEPTED'
const CALL_ENDED = 'CALL_ENDED'

const pubsub = new PubSub()

const videoCallResolver = {
    Subscription: {
        userCalled: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([USER_CALLED]),
                (payload, variables) => {
                    console.log(payload, variables);
                    return true;
                }
            )
        },
        callAccepted: {
            subscribe: () => pubsub.asyncIterator([CALL_ACCEPTED])
        },
        callEnded: {
            subscribe: () => pubsub.asyncIterator([CALL_ENDED])
        }
    },
    Mutation: {
        makeCall: combineResolvers(
            isAuthenticated,
            async  (_, { from, to, offer, debateId }, { models }) => {
                const isOnline = await models.VideoCall.isOnline([from, to]);
                if (!isOnline) {
                    return null;
                }
                await models.VideoCall.createCall(
                    from, to, offer, debateId
                );
                pubsub.publish(
                    USER_CALLED, {
                    userCalled: {
                        from,
                        to,
                        offer,
                        answer: null
                    }
                });
                return true;
            }
        ),
        acceptCall: combineResolvers(
            isAuthenticated,
            async (_, { offer: answer, debateId }, { models }) => {
                const activeCall = await models.VideoCall.acceptCall(
                    answer, debateId
                );
                pubsub.publish(
                    CALL_ACCEPTED, {
                    callAccepted: { ...activeCall }
                });
                return true;
            }
        ),
        endCall: combineResolvers(
            isAuthenticated,
            async (_, { debateId }, { models }) => {

                pubsub.publish(CALL_ENDED, {
                    callEnded: { args: { debateId } }
                });

                return await models.VideoCall.endCall(debateId);
            }
        )
    },  
    Query: {
        onlineUsers: async (parent, { debateId }, { models }) => {
            const userIds = await models.VideoCall.getOnlineUsers(debateId);
            const userObjectIds = userIds.map(d => Types.ObjectId(d));
            return models.User.find({
                '_id': {
                    $in: userObjectIds
                }
            });
        }
    }
}

module.exports = videoCallResolver;