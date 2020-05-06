const mongoose = require('mongoose');

const User = require('./user');
const Debate = require('./debate');
const VideoCall = require('./videoCall');


const connectDb = () => {
    if (process.env.DATABASE_URL) {
        return mongoose.connect(
            process.env.DATABASE_URL,
            { useNewUrlParser: true }
        )
    }
    return Promise.reject('DB connection unavailable');
};
const models = { User, Debate, VideoCall };
    
module.exports = {
    connectDb, models
};