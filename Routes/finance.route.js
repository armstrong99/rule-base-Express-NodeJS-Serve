const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())

 const finRouter = express.Router();

let financeControllers = require('../Controllers/finance.controller')

 finRouter.post('/finance/:userID/:loginStr', financeControllers.postFinance)
//  finRouter.post('/finance/:userID/changeFs', financeControllers.changeFS)
 finRouter.get('/finance/:userID/:loginStr', financeControllers.getFinance)
 finRouter.post('/finance/:userID/modify/:loginStr', financeControllers.modifyDb)
 finRouter.get('/finance/:userID/getweekly/week', financeControllers.weekly)
 finRouter.get('/finance/:userID/getMonthly/month', financeControllers.monthly)
 finRouter.get('/finance/:userID/getDaily/day', financeControllers.daily)

module.exports = finRouter