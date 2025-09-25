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


async function create (req, res) {

    try {
        data = req.body
        const newReview = await Reviews.createReview(data)
        res.status(201).json({'Did it work': 'Success' });

    } 
    catch (err) {
    res.status(401).json({ error: err.message });
    }
}


module.exports = { 
    index,
    show,
    create
}