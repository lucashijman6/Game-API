const express = require('express')
const router = express.Router()
const Game = require('../models/game')

router.get('/', async (req, res, next) => {
    res.header('Allow', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    try {
        const games = await Game.find()
        let items = []
        for (let i = 0; i < games.length; i++) {
            let game = games[i].toJSON()
            game._links = {
                self: {href: "http://" + req.headers.host + "/games/" + game._id},
                collection: {href: "http://" + req.headers.host + "/games"}
            }
            items.push(game)
        }
        let collection = {
            items: items,
            _links: {
                self: {href: "http://" + req.headers.host + "/games"}
            },
            pagination: {geen: "pagination"}
        }
        res.status(200).json(collection)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    if(req.header('Accept') === "application/json") {
        next()
    } else {
        return { message: "Accept header niet ok!" }
    }
})

router.get('/:id', getGame, (req, res, next) => {
    res.header('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS')
    let collection = {
        item: res.game,
        _links: {
            self: {href: "http://" + req.headers.host + "/games/" + res.game._id},
            collection: {href: "http://" + req.headers.host + "/games"}
        }
    }
    res.status(200).json(collection)
    if(req.header('Accept') === "application/json") {
        next()
    } else {
        return { message: "Accept header niet ok!" }
    }
})

router.post('/', async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    const game = new Game({
        name: req.body.name,
        company: req.body.company,
        console: req.body.console,
        release: req.body.release
    })
    try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
    if(req.header('Accept') === "application/json") {
        next()
    } else {
        return { message: "Accept header niet ok!" }
    }
    if(req.header('Content-Type') === "application/json") {
        next()
    } else {
        return { message: "Content-Type header niet ok!" }
    }
})

router.patch('/:id', getGame, async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    if (req.body.name != null) {
        res.game.name = req.body.name
    }
    if (req.body.company != null) {
        res.game.company = req.body.company
    }
    if (req.body.console != null) {
        res.game.console = req.body.console
    }
    if (req.body.release != null) {
        res.game.release = req.body.release
    }
    try {
        const updatedGame = await res.game.save()
        res.status(200).json(updatedGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
    if(req.header('Accept') === "application/json") {
        next()
    } else {
        return { message: "Accept header niet ok!" }
    }
    if(req.header('Content-Type') === "application/json") {
        next()
    } else {
        return { message: "Content-Type header niet ok!" }
    }
})

router.put('/:id', getGame, async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    if (req.body.name != "" && req.body.company != "" && req.body.console != "" && req.body.release != "" && req.body.name != null && req.body.company != null && req.body.console != null && req.body.release != null) {
        res.game.name = req.body.name
        res.game.company = req.body.company
        res.game.console = req.body.console
        res.game.release = req.body.release
    } else {
        return res.json({ message: "Values can't be empty!"})
    }
    try {
        const updatedGame = await res.game.save()
        res.status(200).json(updatedGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
    if(req.header('Accept') === "application/json") {
        next()
    } else {
        return { message: "Accept header niet ok!" }
    }
    if(req.header('Content-Type') === "application/json") {
        next()
    } else {
        return { message: "Content-Type header niet ok!" }
    }
})

router.delete('/:id', getGame, async (req, res, next) => {
    try {
        await res.game.remove()
        res.status(204).json({ message: 'Game was deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getGame(req, res, next) {
    let game
    try {
        game = await Game.findById(req.params.id)
        if (game == null) {
            return res.status(404).json({ message: 'Cannot find game!' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.game = game
    next()
}

controlMessage(1)
router.options('/', (req, res) => {
    controlMessage(4)
    res.header('Allow', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
})

router.options('/:id', getGame, (req, res) => {
    controlMessage(5)
    res.header('Allow', 'GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
})

function controlMessage(a) {
    console.log("Dit is controlebericht " + a + "!")
}

module.exports = router