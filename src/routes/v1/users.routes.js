const express = require('express')
const usersRoutes = express.Router()
const usersControllers = require('../../controllers/userController')

usersRoutes.get('/user/:id',usersControllers.findUser)

usersRoutes.post('/users',usersControllers.addUser)

usersRoutes.patch('/user/:id',usersControllers.changeUser)

module.exports = usersRoutes