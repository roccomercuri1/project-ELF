const express = require('express')
const cors = require('cors')

const reviewsRouter = require('./routes/reviews')
const userRouter = require('./routes/user')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/reviews', reviewsRouter)
app.use('/user', userRouter)

module.exports = app