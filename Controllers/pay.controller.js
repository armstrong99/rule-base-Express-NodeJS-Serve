require('dotenv').config();
let randomString = require('crypto-random-string')
var nodemailer = require('nodemailer');
const paystack = require('paystack')(process.env.API_KEY);
// const Db = require('../connect.db');
let {createUserModel, giveModel} = require('../Mongo/wealthModel')


exports.confirmPayment = async (req, res, next) => {
    
     const { refID, userID } = req.params;
     let bodyPay = {
                            isVerified: false,
                            amount: 3000 / 100,
                            confirmID: randomString({length: 120}),
                            name: 'bodyPay',
                             datePaid: new Date().toDateString(),
                            refID: 'ruryr7373883736366373',
                            password:false,
                            _id: 79000000000000,
                        };
     try {
        giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
            if(err) {
                // console.log(err)
            } else {
                // console.log(resDoc.length)
                if(resDoc.length < 1) {
                    // let wealthModel = mongoose.model(userID, wealthSchema)
                    // let userPay = new wealthModel(bodyPay)
                    let userPay = createUserModel(userID, bodyPay)
                    userPay.save().then(done => {
                        giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
                            if(!err) {
                              let confirmIDB = resDoc.map(s => s.confirmID)
                                //   console.log(confirmIDB)
                              let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                  user: 'wealthmeservices@gmail.com',
                                  pass: `iamwealthyarmstrong2020`
                                }
                              });
                let linkRedir = `https://iamwealthy.herokuapp.com/Iamwealthy/emaillogin/${confirmIDB[0]}`
                let mailOptions = {
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
                        // console.log(error)
                        res.json({link: `http://localhost:3001/confirmStatus/${userID}/${confirmIDB[0]}`})
                     }
                      else{
                            res.json({link: `https://iamwealthy.herokuapp.com/confirmStatus/${userID}/${confirmIDB[0]}`})
                        }
                     
                  });

              
            } else ''
        })

                    }).catch(e => e)
                } 
                else {
                    giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
                        if(!err) {
                            let confirmIDB = resDoc.map(s => s.confirmID)
                            let transporter = nodemailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                  user: 'wealthmeservices@gmail.com',
                                  pass: `iamwealthyarmstrong2020`
                                }
                              });
                let linkRedir = `https://iamwealthy.herokuapp.com/Iamwealthy/emaillogin/${confirmIDB[0]}`
                let mailOptions = {
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
                        // console.log(error)
                        res.json({link: `https://iamwealthy.herokuapp.com/confirmStatus/${userID}/${confirmIDB[0]}`})
                     }
                      else{
                            res.json({link: `https://iamwealthy.herokuapp.com/confirmStatus/${userID}/${confirmIDB[0]}`})
                        }
                     
                  });
                            

                        }
                    })      
                }
            }
     });  
 


                 
               } 
       catch (error) {
        //    console.log(error.message)
           res.json({err: error.message})
       }};

exports.confirmAccount = async (req, res, next) => {
    try {
        const {userID, bodyPay} = req.params;
 
         giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
             if(err) {res.json({error: 'We couldnt locate your payment details, pls refresh the page or contact our support email'})}
             else {
                 
                 if(resDoc.length < 1) {
                    res.json({error: 'We couldnt locate your payment details, pls refresh the page or contact our support email'})
                 } else {
                        let confirmIDB = resDoc.map(s => s.confirmID)
                        if(bodyPay === confirmIDB[0]) {
                            giveModel(userID).updateOne({"name":"bodyPay"}, {$set: {isVerified: true, dateConfirmed:  new Date()}});
                            res.json({confirm: 'success', refI: confirmIDB[0]});
                        } else res.json({error: 'Your payment details was found but we couldnt process your account due to to a mismatch of documents, pls refresh the page or contact our support email, thanks.'})
                 }
             }
         }) 
        
        
    }
    
    catch (error) {
        // console.log(error);
        res.json({error: 'Account cant be confirmed at this time, pls refresh the page'});
    }


}