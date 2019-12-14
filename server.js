require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.error('Connected to database!'))

app.use(express.json())
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

const gamesRouter = require('./routes/games')
app.use('/games', gamesRouter)

app.listen(8000, () => console.log('Server started!'))