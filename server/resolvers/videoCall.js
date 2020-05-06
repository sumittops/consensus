const { PubSub } = require('apollo-server-express');
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
            subscribe: () => {
                pubsub.asyncIterator(
                    [USER_CALLED]
                )
            }
        },
        callAccepted: {
            subscribe: () => {
                pubsub.asyncIterator(
                    [CALL_ACCEPTED]
                )
            }
        },
        callEnded: {
            subscribe: () => {
                pubsub.asyncIterator(
                    [CALL_ENDED]
                )
            }
        }
    },
    Mutation: {
        makeCall: combineResolvers(
            isAuthenticated,
            async  (_, { callerId, calleeId, callerOffer, debateId }, { models }) => {
                const isOnline = await models.VideoCall.isOnline([callerId, calleeId]);
                if (!isOnline) {
                    return null;
                }
                pubsub.publish(
                    USER_CALLED, {
                    userCalled: {
                        callerId,
                        calleeId,
                        callerOffer,
                        calleeOffer: null
                    }
                });

                return await models.VideoCall.createCall(
                    callerId, calleeId, callerOffer, debateId
                );
                
            }
        ),
        acceptCall: combineResolvers(
            isAuthenticated,
            async (_, { calleeOffer, debateId }, { models }) => {
                const [success, activeCall] = await models.VideoCall.acceptCall(
                    calleeOffer, debateId
                );
                if (success) {
                    pubsub.publish(
                        CALL_ACCEPTED, {
                        callAccepted: { args:  activeCall }
                    });
                }
                return success;
                
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