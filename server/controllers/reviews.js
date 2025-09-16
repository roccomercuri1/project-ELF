const Reviews = require('../models/Reviews')

async function index (req, res) {
    try {
        const review = await Reviews.getAll()
        res.status(200).json(review)
    } catch(err) {
        res.status(404).json({ error: err.message })
    }
}

async function show (req, res) {
    try {
        let userId = req.params.id
        const review = await Reviews.getOneByUserId(userId)
        res.status(200).json(review)
    } catch(err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = { 
    index,
    show
}