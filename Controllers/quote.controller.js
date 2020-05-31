let {createUserModel, giveModel} = require('../Mongo/wealthModel')

exports.postQuote = async (req, res) => {
     const {userID, loginStr} = req.params
      
    giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
        if(!err) {
           let dbLoginString = resDoc[0].loginString;
           if(dbLoginString === loginStr){
                try {
                   giveModel(userID).updateOne({"_id": 0}, {$set: {quotes: req.body}}, (err, ans) => {
                    if(err) {
                       res.json({error: 'A technical error occured, pls refresh page'})
                    }
                    else {
        
                        res.json({success: 'success'})
                    }
                })
                } 
                catch (error) {
                    
                }
           } 
          else {
            console.log('not log')
            res.json({error: 'you are not logged in'})
           }   
          }
    })
 
}

exports.getQuote = async (req, res) => {
    const {userID} = req.params
 
try {
 
    giveModel(userID).find({_id: 0}, (err, resDoc) => {
        if(!err) {
             if(resDoc.length > 0) {
                 const{quotes} = resDoc[0]
                res.send(quotes)
            }
        }
        
    })

    
 } 

catch (error) {
    res.send(error.message)
    console.log(error)
}

}