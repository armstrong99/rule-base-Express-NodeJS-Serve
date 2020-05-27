const Db = require('../connect.db')
const wealthDb = Db.connectDb()
const bcrypt = require('bcrypt');
const saltRounds = 12;
let randomString = require('crypto-random-string')


exports.login_New_User = async (req, res, next) => {

    //   console.log(req.body, 'this is login', req.params)
try {
  
let {email, password} = req.body
let {refID} = req.params

 


//check if account is verified and if refID corresponds first pls
let refErr = 'account cant be verified'    

let confirmIDB = await (await wealthDb).collection(email).find({name: "bodyPay"}).map(s => s.confirmID).toArray()
console.log(refID === confirmIDB[0])

if(refID === confirmIDB[0]) {

    let userData = (await (await wealthDb).collection(email).find({name: 'bodyPay'}).toArray()).map(s => s.isVerified)
    // console.log(hashRes)
    //we used false here because for user verifying true mail there's no way to set verify true, letter in the future we can create a seperate endpoint for them
    if(userData[0] === true || userData[0] !== true) {
        
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if(!err) {
     
               (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {password:hash, loginState: 'online', loginString: randomString({length: 120})}});
                
              let [{loginString}] = await ((await wealthDb).collection(email).find({name:'bodyPay'}).toArray());

                // console.log(loginString);

                (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {confirmID: ''}});

                  res.json({success: 'account Success', lStr: loginString});
         
            }
        
        else throw err
        });
    } 
    
    else {
        console.log('account')
        res.json({account: 'Account is not verified'})
    }
}
else throw refErr



//store the harsh

//set a login string and set loginState: true
  
}
 catch (error) {
console.log(error)
res.json({err: error})    
}



}

exports.login_Old_User = async (req, res, next) => {
    let {email, password} = req.body

    console.log(email, password)
try {
      //get the password from DB
      let passDB = await (await wealthDb).collection(email).find({name: "bodyPay"}).map(s => s.password).toArray()

      bcrypt.compare(password, passDB[0], async (err, result) => {
      if(result === true) {
           await (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {loginState: 'online', loginString: randomString({length: 120})}});
  
           let [{loginString}] = await ((await wealthDb).collection(email).find({name:'bodyPay'}).toArray());
  
           res.json({success: 'password Success', lStr: loginString});
          }
      else if(result === false) {
          res.json({err: 'password is incorrect'})
      } 
      else {
           res.json({err: 'an error occured try again'})
      }
   
      });  
}
 catch (error) {
   console.log(error.message) 
}


}

exports.logOut = async (req, res) => {
    const{userID} = req.params
    try {
        (await wealthDb).collection(userID).updateOne({name:'bodyPay'}, {$set: {loginState: 'offline', loginString:''}});

    res.json({log: 'success'})
} 
catch (error) {
    console.log(error.message)
    res.json({log: 'failed'})
    }
    
}