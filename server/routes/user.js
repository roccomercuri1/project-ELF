const { Router } = require('express')

const userController = require('../controllers/user')
const authenticator = require("../middleware/authenticator")

const userRouter = Router ()

userRouter.get('/', authenticator, userController.index)
userRouter.get('/checkPassword', authenticator, userController.checkPassword)
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.patch('/:id', authenticator, userController.update)
userRouter.get('/:id', authenticator, userController.show)
userRouter.post('/forgot-password', userController.forgotPassword)

// userRouter.patch('/:id/password', userController.changePassword)

module.exports = userRouter