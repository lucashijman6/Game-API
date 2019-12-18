const express = require('express')
const router = express.Router()
const Game = require('../models/game')

router.get('/', async (req, res, next) => {
    let headers = {}
    res.header('Allow', 'GET, POST, OPTIONS')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    if(req.accepts('*/*')) {
        return res.status(406).json({ message: "Dit formaat is niet toegestaan."})
    } else if(req.accepts(['application/json', 'application/x-www-form-urlencoded'])) {
        console.log("Je hebt het juiste formaat te pakken!")
    } else {
        return res.status(406).json({ message: "Dit formaat is niet toegestaan."})
    }
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
        return res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGame, (req, res, next) => {
    let headers = {}
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    let collection = {
        item: res.game,
        _links: {
            self: {href: "http://" + req.headers.host + "/games/" + res.game._id},
            collection: {href: "http://" + req.headers.host + "/games"}
        }
    }
    res.status(200).json(collection)
})

router.post('/', async (req, res, next) => {
    if (req.body.name != "" && req.body.company != "" && req.body.console != "" && req.body.release != "" && req.body.name != null && req.body.company != null && req.body.console != null && req.body.release != null) {
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
            return res.status(400).json({message: err.message})
        }
    } else {
        return res.status(400).json({ message: "Values can't be empty!"})
    }
})

router.put('/:id', getGame, async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    if(req.header('Accept') === "application/json") {
    } else {
        return res.status(406).json({ message: "Accept header niet ok!" })
    }
    if(req.header('Content-Type') === "application/json") {
    } else {
        return res.status(406).json({ message: "Content-Type header niet ok!" })
    }
    if (req.body.name != "" && req.body.company != "" && req.body.console != "" && req.body.release != "" && req.body.name != null && req.body.company != null && req.body.console != null && req.body.release != null) {
        res.game.name = req.body.name
        res.game.company = req.body.company
        res.game.console = req.body.console
        res.game.release = req.body.release
    } else {
        return res.status(400).json({ message: "Values can't be empty!"})
    }
    try {
        const updatedGame = await res.game.save()
        res.status(200).json(updatedGame)
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getGame, async (req, res, next) => {
    try {
        await res.game.remove()
        res.status(204).json({ message: 'Game verwijderd!' })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

async function getGame(req, res, next) {
    let game
    try {
        game = await Game.findById(req.params.id)
        if (game == null) {
            return res.status(404).json({ message: 'Game niet gevonden!' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.game = game
    next()
}

router.options('/', function(req, res) {
    let headers = {}
    headers['Allow'] = 'GET, POST, OPTIONS'
    headers['Access-Control-Allow-Origin'] = "*"
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    headers['Content-Length'] = 0
    headers['Content-Type'] = 'text/html'
    res.writeHead(200, headers)
    res.send()
})

router.options('/:id', getGame, (req, res) => {
    let headers = {}
    headers['Allow'] = 'GET, PUT, PATCH, DELETE, OPTIONS'
    headers['Access-Control-Allow-Origin'] = "*"
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    headers['Access-Control-Allow-Methods'] = 'GET, PUT, PATCH, DELETE, OPTIONS'
    headers['Content-Length'] = 0
    headers['Content-Type'] = 'text/html'
    res.writeHead(200, headers)
    res.send()
})

function controlMessage(a) {
    console.log("Dit is controlebericht " + a + "!")
}

module.exports = router