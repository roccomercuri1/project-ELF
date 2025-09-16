const { Router } = require("express");
const reviewsController = require("../controllers/reviews");

const reviewsRouter = Router();

reviewsRouter.get('/', reviewsController.index)
reviewsRouter.get('/:id', reviewsController.show)

module.exports = reviewsRouter