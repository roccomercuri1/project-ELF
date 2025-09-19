const { Router } = require('express')

const userController = require('../controllers/user')
const authenticator = require("../middleware/authenticator")

const userRouter = Router ()

userRouter.get('/', userController.index)
userRouter.get('/checkPassword', userController.checkPassword)
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.patch('/:id', userController.update)
userRouter.get('/:id', userController.show)

module.exports = userRouter