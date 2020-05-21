const mongoose = require('mongoose');

const User = require('./user');
const Debate = require('./debate');
const VideoCall = require('./videoCall');

function getConnection(retries = 1) {
    let attempts = 1;
    return new Promise((resolve, reject) => {
        function establishConnection(n) {
            if (n == 0) {
                reject(new Error('Unable to connect to db'));
            }
            console.log('connection attempt #', attempts);
            mongoose.connect(
                process.env.DATABASE_URL,
                { useNewUrlParser: true }
            ).then(connection => {
                console.log('db connected');
                resolve(connection);
            }).catch(() => {
                if (n > 0) {
                    attempts++;
                    console.log('retrying db connection');
                    setTimeout(() => {
                        establishConnection(n - 1)
                    }, attempts * 2000)
                }
            });
        }

        return establishConnection(retries)
    });
}

const connectDb = async () => {
    if (process.env.DATABASE_URL) {
        return await getConnection(10)
    }
    return Promise.reject('DB connection unavailable');
};
const models = { User, Debate, VideoCall };
    
module.exports = {
    connectDb, models
};