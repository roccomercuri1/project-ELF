const { Router } = require('express')

const userController = require('../controllers/userController')


const userRouter = Router ()

userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.patch('/:id', userController.update)
userRouter.get('/:id', userController.show)

module.exports = userRouter