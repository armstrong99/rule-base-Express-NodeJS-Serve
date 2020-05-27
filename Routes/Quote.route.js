const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())

 const quoRouter = express.Router();

 let quoteController = require('../Controllers/quote.controller')

 quoRouter.post('/quote/:userID/:loginStr', quoteController.postQuote)
 quoRouter.get('/quote/:userID', quoteController.getQuote)


 
module.exports = quoRouter