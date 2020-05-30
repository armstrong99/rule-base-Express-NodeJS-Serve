const Db = require('../connect.db')
const wealthDb = Db
const bcrypt = require('bcrypt');
const saltRounds = 12;
let randomString = require('crypto-random-string')
let {createUserModel, giveModel} = require('../Mongo/wealthModel')



exports.login_New_User = async (req, res, next) => {

     console.log(req.body, 'this is login', req.params)
try {
  
let {email, password} = req.body
let {refID} = req.params
   
//check if account is verified and if refID corresponds first pls

// let refErr = 'account cant be verified' 

giveModel(email).find({name: "bodyPay"}, (err, resDoc) => {

    if(err) { console.log(err)
        res.json({error: 'A technical errors occured pls retry, thanks. '})
    }

    else {
        if(resDoc.length < 1) {

            res.json({error: 'A technical errors occured pls retry, thanks. '}) 

       }  
       else {
        let confirmIDB = resDoc.map(s => s.confirmID)
        console.log( confirmIDB[0] )
        if(refID === confirmIDB[0]) {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if(!err) {
         
                await giveModel(email).updateOne({name:'bodyPay'}, {$set: {password:hash, loginState: 'online', loginString: randomString({length: 120})}});
                    giveModel(email).find({name:'bodyPay'}, (err, resDoc) => {
                        if(!err) {
                        //    console.log(resDoc)
                            giveModel(email).updateOne({name:'bodyPay'}, {$set: {confirmID: ''}})
                            let loginString = resDoc.map(s => s.loginString)
                            
                            res.json({success: 'account Success', lStr: loginString[0]});

                        } else res.json({error: 'A technical errors occured pls retry, thanks. '}) 

                    })
                //   let [{loginString}] = await ((await wealthDb).collection(email).find({name:'bodyPay'}).toArray());
    
                    // // console.log(loginString);
    
                    // (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {confirmID: ''}});
    
                    //   res.json({success: 'account Success', lStr: loginString});
             
                }
            
            else throw new Error('A technical error occured, pls refresh the page and retry thanks')
            });
        } 
        else {res.json({error: `Error: There's a mismatch of documents, pls retry or try login in`})}
    }
    }
})

// let confirmIDB = await (await wealthDb).collection(email).find({name: "bodyPay"}).map(s => s.confirmID).toArray()
// console.log(refID === confirmIDB[0])

// if(refID === confirmIDB[0]) {

//     let userData = (await (await wealthDb).collection(email).find({name: 'bodyPay'}).toArray()).map(s => s.isVerified)
//     // console.log(hashRes)
//     //we used false here because for user verifying true mail there's no way to set verify true, letter in the future we can create a seperate endpoint for them
//     if(userData[0] === true || userData[0] !== true) {
        
//         bcrypt.hash(password, saltRounds, async (err, hash) => {
//             if(!err) {
     
//                (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {password:hash, loginState: 'online', loginString: randomString({length: 120})}});
                
//               let [{loginString}] = await ((await wealthDb).collection(email).find({name:'bodyPay'}).toArray());

//                 // console.log(loginString);

//                 (await wealthDb).collection(email).updateOne({name:'bodyPay'}, {$set: {confirmID: ''}});

//                   res.json({success: 'account Success', lStr: loginString});
         
//             }
        
//         else throw err
//         });
//     } 
    
//     else {
//         console.log('account')
//         res.json({account: 'Account is not verified'})
//     }
// }
// else throw refErr



//store the harsh

//set a login string and set loginState: true
  
}
 
catch (error) {
console.log(error)
res.json({error: error})    
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