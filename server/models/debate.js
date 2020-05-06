const mongoose = require('mongoose');

const debateSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    forParticipant: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    againstParticipant: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    eventDate: {
        type: Date
    }
}, {
    timestamps: true,
});
const Debate = mongoose.model('Debate', debateSchema, 'debates');
module.exports = Debate;