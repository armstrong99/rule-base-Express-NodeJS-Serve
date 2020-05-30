let Db = require('../connect.db')

exports.postQuote = async (req, res) => {
    const wealthDb = await Db 

    const {userID, loginStr} = req.params
    let dbLoginStr = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.loginString).toArray()
    if(dbLoginStr[0] === loginStr){
        try {
            // let userP = await wealthDb.collection(userID).find({name: 'FS'}).up
           // b
           
           (await wealthDb).collection(userID).updateOne({"_id": 0}, {$set: {quotes: req.body}}, (err, ans) => {
               if(err) {
                   throw err
               }
               else {
   
                   res.json({success: 'success'})
               }
           })
   
          
            
       } 
       catch (error) {
          console.log(error.message) 
       }
    }
   else {
       console.log('not log')
       res.json({error: 'you are not logged in'})}
}

exports.getQuote = async (req, res) => {
    const {userID} = req.params
    const wealthDb = await Db 

try {
 
    let ans =  await wealthDb.collection(userID).find({_id: 0}).toArray()

    const{quotes} = ans[0]
    
//  console.log(quotes)
    res.send(quotes)
} 

catch (error) {
    res.send(error.message)
    console.log(error)
}

}