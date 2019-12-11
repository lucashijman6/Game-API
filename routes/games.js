const express = require('express')
const router = express.Router()
const Game = require('../models/game')

router.get('/', async (req, res) => {
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
        res.json(collection)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGame, (req, res) => {
    let collection = {
        item: res.game,
        _links: {
            self: {href: "http://" + req.headers.host + "/games/" + res.game._id},
            collection: {href: "http://" + req.headers.host + "/games"}
        }
    }
    res.json(collection)
})

router.post('/', async (req, res) => {
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
        res.json(updatedGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.put('/:id', getGame, async (req, res) => {
    res.game.name = req.body.name
    res.game.company = req.body.company
    res.game.console = req.body.console
    res.game.release = req.body.release
    try {
        const updatedGame = await res.game.save()
        res.json(updatedGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getGame, async (req, res) => {
    try {
        await res.game.remove()
        res.json({ message: 'Game was deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/*router.options('/', async (req, res) => {
    try {
        await options()
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.options('/:id', getGame, async (req, res) => {
    try {
        await options()
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})*/

async function getGame(req, res, next) {
    let game
    try {
        game = await Game.findById(req.params.id)
        if (game == null) {
            return res.status(404).json({ message: 'Cannot find game!' })
        }
    } catch (err) {
        return res.status(500).json({message: err.message })
    }
    res.game = game
    next()
}

module.exports = router