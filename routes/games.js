const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const cors = require('cors')

router.get('/', async (req, res) => {
    //controlMessage()
    res.header('Allow', 'GET, HEAD, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
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
})

router.get('/:id', getGame, (req, res) => {
    //controlMessage()
    res.header('Allow', 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS')
    res.header('Content-Type', "application/json")
    let collection = {
        item: res.game,
        _links: {
            self: {href: "http://" + req.headers.host + "/games/" + res.game._id},
            collection: {href: "http://" + req.headers.host + "/games"}
        }
    }
    res.status(200).json(collection)
})

router.post('/', async (req, res) => {
    //controlMessage()
    res.header('Content-Type', "application/json")
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
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
})

router.patch('/:id', getGame, async (req, res) => {
    //controlMessage()
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.header('Content-Type', "application/json")
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
})

router.put('/:id', getGame, async (req, res) => {
    //controlMessage()
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.header('Content-Type', "application/json")
    res.game.name = req.body.name
    res.game.company = req.body.company
    res.game.console = req.body.console
    res.game.release = req.body.release
    try {
        const updatedGame = await res.game.save()
        res.status(200).json(updatedGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getGame, async (req, res) => {
    //controlMessage()
    try {
        await res.game.remove()
        res.status(204).json({ message: 'Game was deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.options('/', (req, res, next) => {
    controlMessage()
    res.header('Allow', 'GET, HEAD, POST, OPTIONS')
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
})

router.options('/:id', getGame, (req, res, next) => {
    controlMessage()
    res.header('Allow', 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
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

function controlMessage() {
    console.log("Controlebericht!")
}

module.exports = router