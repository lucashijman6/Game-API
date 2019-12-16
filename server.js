require('dotenv').config()

const express = require('express')
const app = express(controlMessage(1))
const mongoose = require('mongoose')
// const cors = require('cors')
const bodyParser = require('body-parser')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.error('Connected to database!'))

app.use(express.json(controlMessage(2)))
// app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

/*app.use( function(req, res, next) {
    console.log("request");
    next();
})*/

const gamesRouter = require('./routes/games')
app.use('/games', gamesRouter)

app.listen(8000, () => console.log('Server started!'))

function controlMessage(b) {
    console.log("Dit bericht checkt plek " + b)
}