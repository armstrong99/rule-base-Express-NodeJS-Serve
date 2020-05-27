let Db = require('../connect.db')

exports.postFinance = async (req, res) => {
    console.log(req.params)
    const {userID,loginStr} = req.params
    const wealthDb = await Db.connectDb()

    let dbLoginStr = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.loginString).toArray()
// console.log(dbLoginStr[0] )
if(dbLoginStr[0] === loginStr){
    let checkArr = await wealthDb.collection(userID).find({name: 'FS'}).toArray()
    
    try {
   
     if(checkArr.length < 1) {
    const userP = {name: 'FS', number: req.body.length, _id: 0, fsKeys: req.body.map(s => s.budg)}
    
    req.body.unshift(userP)
    let mRes = await  wealthDb.collection(userID).insertMany(req.body) 

    if(mRes) {

        return res.json({save: true})
    }

    else throw Error
 } 
    else {
         
        let userP = await wealthDb.collection(userID).find({name:'FS'}).map(s => s.fsKeys).toArray()
        // let userP_Quote = await wealthDb.collection(userID).find({name:'FS'}).map(s => s.quotes).toArray()

       let moneyLeft = await userP[0].map(fsItem =>{
         return wealthDb.collection(userID).find({budg: fsItem, updated: true}).sort({_id: -1}).limit(1).toArray()}
        )
            let m_ans = [];
       
            for (let i = 0; i < moneyLeft.length; i++) {
             
             let ans = await moneyLeft[i]
             if(ans[0] !== undefined) {
                 m_ans.push(ans[0])
             }
            }

           let totalMoney = m_ans.map(s => s.money).reduce((prev, currv) => prev + currv)

             
          let nReqBody = req.body.map(s => {
            let unitMon = totalMoney * s.rPerc / 100
            s.money = 0
            let newMon = s.money + unitMon
            s.money = newMon
            s.diff = unitMon
            s.day = new Date().toDateString().substring(0,4).trim()
            s.dayNo = Number( new Date().toDateString().substring(7,10).trim() )
            s.month = new Date().toDateString().substring(4,7).trim()
            s.year = Number( new Date().toDateString().substring(10,15).trim() )
            s.timeTrans = Date().substring(15, 21).trim()
            s.purpose = "Change my Fin. structure"
            s.recivBol = true
            s.spendBol = false
            s.updated = true

            return s
           })

           
       await wealthDb.collection(userID).insertMany(nReqBody)
          
      wealthDb.collection(userID).updateOne({"_id": 0}, {$set: {number: nReqBody.length, fsKeys: nReqBody.map(s => s.budg)}}, (err, ans) => {
          if(err) {throw err}
          else  { res.json({save: true})}
      })
   
   
  
           



        // let delRes = await wealthDb.collection(userID).deleteOne({name: 'FS'})
        // if(delRes) {
        //     console.log(userP_Quote[0])
        //     const userP = {name: 'FS', number: nReqBody.length, _id: 0, fsKeys: nReqBody.map(s => s.budg), quotes: userP_Quote}

        //     nReqBody.unshift(userP)

        //     let mRes = await wealthDb.collection(userID).insertMany(nReqBody) 

        //     if(mRes) {

        //         return res.json({save: true})
        //     }

        //     }

 }
    
}

catch(e) {
    console.log(e.message)
     return res.json({error: 'duplicate'})

 }
}
 
else res.json({error: 'you are not logged in'})

    

}

exports.getFinance = async (req, res) => {
    setTimeout( async () => {
        
        let{userID, loginStr} = req.params
            
        let wealthDb = await Db.connectDb()
        //  console.log(loginStr, 'me str')
    
        let dbLoginStr = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.loginString).toArray()
    //    console.log('dbS', dbLoginStr)
        if(dbLoginStr[0] === loginStr) {
    
            try{
                
                let userP = await wealthDb.collection(userID).find({name:'FS'}).map(s => s.fsKeys).toArray()
        
               let moneyLeft = await userP[0].map(fsItem =>{
                 return wealthDb.collection(userID).find({budg: fsItem, updated: true}).sort({_id: -1}).limit(1).toArray()}
                )
                    let m_ans = [];
               
                    for (let i = 0; i < moneyLeft.length; i++) {
                     
                     let ans = await moneyLeft[i]
                     if(ans[0] !== undefined) {
                         m_ans.push(ans[0])
                     }
                    }
                    
                    res.json(m_ans)
                 
            
            //     let wealthDb = await Db.connectDb()
            //     let userP = await wealthDb.collection(userID).find({name: 'FS'}).sort({name: -1}).limit(1).toArray()
           
            //   const {number} = userP[0]
                
            //  let cursor =  wealthDb.collection(userID).find({budg: {$exists: true}}).sort({_id: -1}).limit(number).toArray()
        
            //  let mRes = await cursor
        
             
            //   res.json(mRes) 
         
            }
        
            catch(e) {
                console.log(e.message)
                if(e.message === "Cannot read property 'map' of undefined") {
        
                    return res.json({e: 'no entry'})
                } 
        
            }
        }
         else res.json({err: 'you are not logged in'})
    }, 1000);
}

exports.modifyDb = async (req, res) => {
    // console.log(req.params)
    const {userID, loginStr} = req.params
    let wealthDb = await Db.connectDb()
    let dbLoginStr = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.loginString).toArray()
    if(dbLoginStr[0] === loginStr) {

        try {
         let notify = await wealthDb.collection(userID).insertMany(req.body)
    
        if(notify) {
            res.json({status: 'successfull'})
            
    
        }
         
            
         
     
    
        }
    
        catch(e) {
             res.json({error: 'unable to modify'})  
              }
    }
    else {
        res.json({error: 'unable to modify'}) 
    }
 
}

exports.weekly = async (req, res) => {

const {userID} = req.params
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const maxDayMonth = [ 
    {mth: 'Jan', mD: 31},
    {mth: 'Feb', mD: 31},
    {mth: 'Mar', mD: 31},
    {mth: 'Apr', mD: 31},
    {mth: 'May', mD: 31},
    {mth: 'Jun', mD: 31},
    {mth: 'Jul', mD: 31},
    {mth: 'Aug', mD: 31},
    {mth: 'Sep', mD: 31},
    {mth: 'Oct', mD: 31},
    {mth: 'Nov', mD: 31},
    {mth: 'Dec', mD: 31},
 ]
  let today = Number( new Date().toDateString().substring(7,10).trim()) 
  let currMth = new Date().toDateString().substring(4,7).trim()

  //this is for prevMonths
  let iPMonth = monthArr.indexOf(currMth) - 1 
  let pMonthV = monthArr[iPMonth]
  let pMonthObj = maxDayMonth.filter(s => s.mth === pMonthV )
  let maxDayPMonth = pMonthObj[0].mD 



  const wealthDb = await Db.connectDb()
  let pastS = today - 7

      if(pastS > 0) {

        try {
            let pastWeek = await wealthDb.collection(userID).find({month:currMth, dayNo: {$lte: today, $gte: pastS}}).toArray()
          return res.send( pastWeek ) 
            
        } 
        
        catch (error) {
            return res.send(error)
        }
     }
     if(pastS === 0) {
        try {
            let pastWeek = await wealthDb.collection(userID).find({month:currMth, dayNo: {$lte: today, $gte: 1}}).toArray()
            res.send(pastWeek)
        } catch (error) {
            res.send(error)
        }
     }
     if(pastS < 0) {
         let monthUIArr 
        try {

            let pastWeek = await wealthDb.collection(userID).find({month:currMth, dayNo: {$lte: today, $gte: 1}}).toArray()
            monthUIArr = pastWeek

             let pPWeek = await wealthDb.collection(userID).find({month:pMonthV, dayNo: {$lte: maxDayPMonth, $gte: maxDayPMonth + pastS}}).toArray()

            monthUIArr.push(...pPWeek)
            
            res.send(monthUIArr)
             
            
          } 
          catch (error) {
            res.json({error: 'unsuccessfull'})
        }
     }
    }
exports.monthly = async (req, res) => {
    const {userID} = req.params
    let currYear = Number( new Date().toDateString().substring(10,15).trim() )  

    let currMonth = new Date().toDateString().substring(4,7).trim() 

    const wealthDb = await Db.connectDb()

    try {
       let monthData = await wealthDb.collection(userID).find({month: currMonth, year: currYear }).toArray()
       
       return res.send(monthData)
    }
    catch (error) {
        res.json({error: 'unsuccessfull'})
    }


  

}

exports.daily = async (req, res) => {
    const {userID} = req.params
    const wealthDb = await Db.connectDb()
    let today = Number( new Date().toDateString().substring(7,10).trim()) 
 try {
    let resDay = wealthDb.collection(userID).find({ dayNo: today }).toArray()
   
    if(resDay) {

        res.json({dailyRecs: await resDay})

    }
} catch (error) {

    res.json({dailyRecs: ['No daily records']})
}  
}

// exports.changeFS = async (req, res) => {
//     const userP = {name: 'FS', number: req.body.length, _id: 0}
//     req.body.unshift(userP)
//     const {userID} = req.params
//     let wealthDb = await Db.connectDb()

 
 


// }