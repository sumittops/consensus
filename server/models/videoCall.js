const { uniq } = require('lodash');
const redisClient = require('../services/redisClient');

class VideoCall {
    client;
    constructor() {
        this.client = redisClient;
        this.debateUsersKey = 'debateusers:';
        this.activeCallsMap = 'debatecall:';
        this.allActiveUsers = {};
    }

    getOnlineUsers(debateId) {
        return new Promise((resolve) => {
            this.client.hget(this.debateUsersKey, debateId, (error, reply) => {
                if (error) {
                    return Promise.reject({ 
                        message: 'Query Error',
                        error
                    });
                }
                if (reply) {
                    return resolve(JSON.parse(reply));
                }
                return resolve([]);
            });
        })
    }

    async addOnlineUser(debateId, userId) {
        const existingUsers = await this.getOnlineUsers(debateId);
        return new Promise((resolve) => {
            const updatedUsers = uniq([...existingUsers, userId]);
            updatedUsers.forEach(userId => {
                this.allActiveUsers[userId] = true;
            });
            this.client.hset(this.debateUsersKey, debateId, JSON.stringify(updatedUsers), () => {
                resolve(updatedUsers);
            });
        })
    }

    async removeOnlineUser(debateId, userId) {
        const existingUsers = await this.getOnlineUsers(debateId);
        return new Promise((resolve) => {
            const updatedUsers = existingUsers.filter(
                (uid) => uid !== userId
            );
            delete this.allActiveUsers[userId];
            this.client.hset(this.debateUsersKey, debateId, JSON.stringify(updatedUsers), () => {
                resolve(updatedUsers);
            });
        });
    }

    isOnline(users) {
        return new Promise((resolve) => {
            users = [];
            users.forEach(
                userId => {
                    if (!this.allActiveUsers[userId]) {
                        resolve(false);
                    }
                }
            );
            resolve(true);
        })
    }

    createCall(from, to, offer, debateId) {
        const activeCall = { 
            from, to, offer, answer: null
        };
        return new Promise(
            (resolve) => this.client.hset(
                this.activeCallsMap,
                debateId,
                JSON.stringify(activeCall),
                n => resolve(n > 0)
            )
        );
    }

    acceptCall(answer, debateId) {
        return new Promise(
            (resolve) => {
                this.client.hget(
                    this.activeCallsMap,
                    debateId, (error, reply) => {
                        if (!error && reply) {
                            const activeCall = JSON.parse(reply);
                            activeCall.answer = answer;
                            this.client.hset(
                                this.activeCallsMap,
                                debateId,
                                JSON.stringify(activeCall)
                            )
                            resolve(activeCall);
                        }
                        if (error) {
                            console.error(error)
                        }
                        resolve(false)
                    }
                )
            }
        )
    }

    endCall (debateId) {
        return new Promise((resolve) => {
            this.client.hdel(this.activeCallsMap, debateId, (n) => {
                resolve(n > 0) ;
            })
        })
    }

}


module.exports = new VideoCall();