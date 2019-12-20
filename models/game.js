const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    name: String,
    company: String,
    console: String,
    release: String
})

module.exports = mongoose.model('Game', gameSchema)