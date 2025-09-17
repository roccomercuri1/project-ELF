const { Router } = require("express");
const reviewsController = require("../controllers/reviews");
const authenticator = require("../middleware/authenticator")

const reviewsRouter = Router();

reviewsRouter.get('/',  reviewsController.index,)
reviewsRouter.get('/:id', reviewsController.show)
reviewsRouter.post('/', reviewsController.create)

module.exports = reviewsRouter