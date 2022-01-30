const express = require('express')
const financialRoutes  = express.Router()
const financialControllers = require('../../controllers/financialController')
const multer = require('multer')
const upload = multer()

financialRoutes.post('/finance/:userId/:nrows',upload.single('excel'),financialControllers.handleExcel)

financialRoutes.delete('/finance/:userId/:financialDataId',financialControllers.removeFinancialData)

financialRoutes.get('/finance/:userId/',financialControllers.sumExpenses)

module.exports = financialRoutes