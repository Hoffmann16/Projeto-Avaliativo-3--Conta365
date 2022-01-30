const express = require('express')
const app = express()
const routes = require('./routes')
const swaggerUi = require('swagger-ui-express')
const swaggerdoc = require('./swagger.json')

app.use(express.json());

app.use(routes) 
app.use('/conta365-docs',swaggerUi.serve,swaggerUi.setup(swaggerdoc))

app.listen(3333,()=>console.log('Executando'))