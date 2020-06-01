const express = require( 'express')
const cors = require('cors')
const app = express()
const finRouter = require('./Routes/finance.route')
const Payment = require('./Routes/payment.route')
const quoRouter = require('./Routes/Quote.route')
const authRouter = require('./Routes/auth.route')
 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(Payment)

 
app.use(quoRouter)
app.use(finRouter)
app.use(authRouter)


let port = process.env.PORT || 3001;

module.exports = server = () => app.listen(port, () => console.log('Server is listening on ' + port))

 