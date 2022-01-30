const express = require('express')
const routes = express.Router()
const usersRoutes = require('./v1/users.routes')
const financialRoutes = require('./v1/financial.routes')

routes.use('/conta365', [usersRoutes,financialRoutes] )
// routes.use('/conta365', usersRoutes )

module.exports = routes