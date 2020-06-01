const Db = require('../connect.db')
 const bcrypt = require('bcrypt');
const saltRounds = 12;
let randomString = require('crypto-random-string')
let {giveModel} = require('../Mongo/wealthModel')



exports.login_New_User = async (req, res, next) => {

 try {
  
let {email, password} = req.body
let {refID} = req.params
   
 

giveModel(email).find({name: "bodyPay"}, (err, resDoc) => {

    if(err) { res.json({error: 'A technical errors occured pls retry, thanks. '})
    }

    else {
        if(resDoc.length < 1) {

            res.json({error: 'A technical errors occured pls retry, thanks. '}) 

       }  
       else {
        let confirmIDB = resDoc.map(s => s.confirmID)
        // console.log( confirmIDB[0] )
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
              
             
                }
            
            else throw new Error('A technical error occured, pls refresh the page and retry thanks')
            });
        } 
        else {res.json({error: `Error: There's a mismatch of documents, pls retry or try login in`})}
    }
    }
})
 
  
}
 
catch (error) {
// console.log(error)
res.json({error: error})    
}



}

exports.login_Old_User = async (req, res, next) => {
    let {email, password} = req.body

 try {
      //get the password from DB
      giveModel(email).find({name: "bodyPay"}, (e, resDoc) => {
          if(!e) {
                if(resDoc < 1) {
                    res.json({err: 'Your email address seems to be incorrect'})
                }
                else {

                    let passDB = resDoc[0].password
                    bcrypt.compare(password, passDB, async (err, result) => {
                       if(result === true) {
                            giveModel(email).updateOne({name:'bodyPay'}, {$set: {loginState: 'online', loginString: randomString({length: 120})}}, (err, resDoc) => {
                             if(!err) {
                               giveModel(email).find({name:'bodyPay'}, (err, resDoc) => {
                                   res.json({success: 'password Success', lStr: resDoc[0].loginString });
                               })
                             }
                              
                            });
                   
                    
                          
                           }
                       else if(result === false) {
                           res.json({err: 'password is incorrect'})
                       } 
                       else {
                            res.json({err: 'an error occured try again'})
                       }
                    
                       });  
                }
            } else res.json({err: 'An error errupted pls refresh page and retry'})
      })
 
    
}
 catch (err) {
//    console.log(err.message) 
}


}

exports.logOut = async (req, res) => {
    const{userID} = req.params
    try {
        giveModel(userID).updateOne({name:'bodyPay'}, {$set: {loginState: 'offline', loginString:''}});
 
      res.json({log: 'success'})
} 
catch (error) {
    // console.log(error.message)
    res.json({log: 'failed'})
    }
    
}