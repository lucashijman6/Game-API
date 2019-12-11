const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    console: {
        type: String,
        required: true
    },
    release: {
        type: String,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Game', gameSchema)