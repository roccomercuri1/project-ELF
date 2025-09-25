const { Router } = require("express");
const reviewsController = require("../controllers/reviews");
const authenticator = require("../middleware/authenticator")

const reviewsRouter = Router();

reviewsRouter.get('/', authenticator, reviewsController.index)
reviewsRouter.get('/:id', authenticator, reviewsController.show)
reviewsRouter.post('/', authenticator, reviewsController.create)



module.exports = reviewsRouter