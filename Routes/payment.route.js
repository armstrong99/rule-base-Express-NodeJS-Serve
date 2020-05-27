const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())

const Payment = express.Router();

let paymentControllers = require('../Controllers/pay.controller')

Payment.get('/pay/confirmTrans/:refID/:userID', paymentControllers.confirmPayment)
Payment.get('/confirmStatus/:userID/:bodyPay', paymentControllers.confirmAccount)
module.exports = Payment

