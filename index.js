const express = require( 'express')
const cors = require('cors')
const app = express()
const finRouter = require('./Routes/finance.route')
const Payment = require('./Routes/payment.route')
const quoRouter = require('./Routes/Quote.route')
const authRouter = require('./Routes/auth.route')
let mongoose = require('mongoose')

let paySchema = require('./Mongo/wealthSchema')
 app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
 app.use(Payment)

app.get('/testModels/:userID', (req, res) => {
    console.log(req.params)
    let mongPayModel = mongoose.model(req.params.userID, paySchema )
    let userPayModel = new mongPayModel([{
             _id: 'fueur8483994884urue7e77e',
             isVerified: false,
             amount: 4300,
             confirmID: 'dkjdkkf939943884848ndnnndnn',
             name: 'bodyPay',
             datePaid: new Date(),
             refID: 'feiiei9eu9irhbww89w9ndjiks',
           password: false
          }, {
            _id: 20000002,
            isVerified: true,
            amount: 500000,
            confirmID: 'dkjdkkf939943884848ndnnndnn',
            name: 'bodyPay',
            datePaid: new Date(),
            refID: 'feiiei9eu9irhbww89w9ndjiks',
          password: 'rururuue8838bcrypt'
         }])
      
    userPayModel.save().then(done => {
       res.json({save:'saved'})
         
    }).catch((e) => console.log(e))
     
    
})
  app.use(quoRouter)
 app.use(finRouter)
app.use(authRouter)


let port = 3001;

module.exports = server = () => app.listen(port, () => console.log('Server is listening on ' + port))

 