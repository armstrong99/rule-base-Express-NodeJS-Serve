require('dotenv')
let randomString = require('crypto-random-string')
var nodemailer = require('nodemailer');


const paystack = require('paystack')('sk_test_3ca003d4c6db3a44505a5ae2419207935e14c850');
const Db = require('../connect.db')
const wealthDb = Db.connectDb()


exports.confirmPayment = async (req, res, next) => {
    
     const { refID, userID } = req.params

     console.log(refID)
   
     setTimeout(() => {
     
    paystack.transaction.verify(refID.toString(), async (error, body) => {
        
        if(body) {
           let msg = body['data']['status']
               if(msg === 'success') {
                   let bodyPay = {
                    isVerified: false,
                    amount: body['data']['amount'] / 100,
                    confirmID: randomString({length: 120}),
                    name: 'bodyPay',
                     datePaid: new Date().toDateString(),
                    refID: refID,
                    password:false
                }
                    try {
                let checkArr = (await wealthDb).collection(userID).find({name: "bodyPay"}).toArray()  

                let ansCHA = await checkArr

                // console.log(ansCHA.length)
                if(ansCHA.length < 1) {
                    (await wealthDb).collection(userID).insertOne(bodyPay, async (err, iRes) => {
                        try {
                            if(err) throw err
                            else {
                              
            let confirmIDB = (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.confirmID).toArray()  
            res.json({link: `http://localhost:3001/confirmStatus/${userID}/${confirmIDB[0]}`})

                    }   
                        }
                         catch (error) {
                            
                        }
                      
                        
                    })
                }
                else {
                    
                    let confirmIDB = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.confirmID).toArray()
                             let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                  user: 'wealthmeservices@gmail.com',
                                  pass: `iamwealthyarmstrong2020`
                                }
                              });
    
                              var linkRedir = `http://localhost:3000/Iamwealthy/emaillogin/${confirmIDB[0]}`
    
                              var mailOptions = {
                                from: 'wealthmeservices@gmail.com',
                                to: userID,
                                subject: 'Welcome to wealth',
                                
                                html: `<article style="width: 80%;
                                height: 50%;
                                margin-top: 0;
                                background-color: #69696966;
                                margin-left: auto;
                                margin-right: auto;
                                padding: 2rem;">
                                        <h1 style='text-align: center; color:limegreen; padding:1rem; background:black'>Iamwealthy</h1>
                                        <p>Hi, Your Payment was successful, pls use the link below to confirm your account </p>
                                        <a href=${linkRedir} target="_blank">Confirm account here</a>
                                    </article>`
                              };
                              transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    console.log(error)
                                    res.json({link: `http://localhost:3001/confirmStatus/${userID}/${confirmIDB[0]}`})
                                 }
                                  else{
                                        res.json({link: `http://localhost:3001/confirmStatus/${userID}/${confirmIDB[0]}`})
                                    }
                                 
                              });
                            }
                        

                     
   
                     

                   } 
                   catch (error) {
                       console.log(error.message)
                       res.json({err: error.message})
                   }
                
               }
        }
        else {
            res.json({error: error.message})
            return console.log(error.message)
       
        }
       
          
       
              }); 
 }, 1200);
 
   
      
    
 

}

exports.confirmAccount = async (req, res, next) => {
    try {
        const {userID, bodyPay} = req.params
// console.log(bodyPay)
        let confirmIDB = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.confirmID).toArray()
        
        //  console.log({bodyPay: bodyPay, confirmIDB: confirmIDB[0]})
        if(bodyPay === confirmIDB[0]) {
        
              (await wealthDb).collection(userID).updateOne({"name":"bodyPay"}, {$set: {isVerified: true, dateConfirmed:  new Date().toDateString()}}) 
            
            //   console.log('success')

             res.json({confirm: 'success', refI: confirmIDB[0]})


        }
         else {
             console.log('error confirm')
            res.json({error: 'Account may already be confirmed, pls login or retry'})
        }
          
    }
    
    catch (error) {
        console.log(error)
    }


}