let Db = require('../connect.db')
let {createUserModel, giveModel} = require('../Mongo/wealthModel')

 exports.postFinance = async (req, res) => {
     try {
          const {userID,loginStr} = req.params
          
        
         giveModel(userID).find({name: "bodyPay"}).exec((err, resDoc) => {
            if(!err) {
               let dbLoginStr = resDoc.map(s => s.loginString)
                if(dbLoginStr[0] === loginStr) {

                    giveModel(userID).find({name: 'FS'}, (err, resDoc) => {
                         if(resDoc.length < 1) {
                            const userP = {name: 'FS', number: req.body.length, _id: 0, fsKeys: req.body.map(s => s.budg)}
                            req.body.unshift(userP)
                            giveModel(userID).insertMany(req.body, (err, resDoc) => {
                                if(!err) res.json({save: true})
                            })
                        }

                         else {
                        giveModel(userID).find({name:'FS'}, (err, resDoc) => {
                            if(!err) {
                           let fsItems = resDoc.map(s => s.fsKeys)
                                let allMoney = []
                           const callback = (err, resDoc) => {
                               if(!err) {
                                    allMoney.push(resDoc[0].money)
                                    if(allMoney.length === fsItems[0].length) {
                                        let totalMoney = allMoney.reduce((prev, curr) => prev + curr)
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
                         giveModel(userID).insertMany(nReqBody, (err, resDoc) => {
                             if(!err) {
                                giveModel(userID).updateOne({"_id": 0}, {$set: {number: nReqBody.length, fsKeys: nReqBody.map(s => s.budg)}}, (err, ans) => {
                                    if(err) {console.log(err)}
                                    else  {
                                         res.json({save: true})
                                        }
                                })   
                             } else {
                                console.log(err.message)
                                return res.json({error: 'duplicate'})                                }
           
                         })

                                    }
                               }
                           }
                               fsItems[0].map((fsI_Arr, i) => {
                                giveModel(userID).find({budg: fsI_Arr}, callback)
                               })


                               
                        }
                        })
                        }
                    })

                }
                else res.json({error: 'you are not logged in'})
            }
         })
     
      
     } 
     catch (error) {
         
     }
 }

exports.getFinance = async (req, res) => {
    setTimeout( async () => {
        
        let{userID, loginStr} = req.params
            
        let wealthDb = await Db
        
        //  console.log(loginStr, 'me str')

    giveModel(userID).find({name: "bodyPay"}, (err, resDoc) => {
        if(!err) {
            if(resDoc.length < 1) {
                res.json({error: 'We couldnt fine some of your details pls refresh the page and retry'})
            } else {
                let dbLoginStr = resDoc.map(s => s.loginString)
                
                if(dbLoginStr[0] === loginStr) {
                        try {
                            giveModel(userID).find({name:'FS'}, (err, resDoc) => {
                                if(!err) {
                                if(resDoc.length < 1) {
                                    res.json({error:'You seem not to have a Financial Struc with us pls do so at the finance page'})
                                } else {
                                   let userP = resDoc.map(s => s.fsKeys)
                                   // console.log(userP)
                                   let dAn = []
                                   const callback = (err, resDoc) => {
                                        dAn.push(resDoc[0])
                                        if(dAn.length === userP[0].length) {
                                            // console.log(dAn)
                                            res.json(dAn)

                                        }
                                   }
                                   for(let i = 0; i < userP[0].length; i++) {
                                   giveModel(userID).find({budg: userP[0][i]}).where('updated').equals(true).sort({_id: -1}).limit(1).exec(callback)

                                      }
                                   }
                                } else res.json({error: 'A technical error occured pls refresh page and retry'})
                            })
                        } 
                        catch (error) {
                            console.log(e.message)
                if(e.message === "Cannot read property 'map' of undefined") {
        
                    return res.json({e: 'no entry'})
                } 
                        }
                } else res.json({error: 'we couldnt verify you pls try login in, thanks'})
            }
        } else {
            res.json({error: 'A technical error occured or you may not be logged in properly,  pls refresh page  or try login in'})
        }
    })
        // let dbLoginStr = await (await wealthDb).collection(userID).find({name: "bodyPay"}).map(s => s.loginString).toArray()
    //    console.log('dbS', dbLoginStr)
        // if(dbLoginStr[0] === loginStr) {
    
        //     try{
                
        //         let userP = await wealthDb.collection(userID).find({name:'FS'}).map(s => s.fsKeys).toArray()
        
        //        let moneyLeft = await userP[0].map(fsItem =>{
        //          return wealthDb.collection(userID).find({budg: fsItem, updated: true}).sort({_id: -1}).limit(1).toArray()}
        //         )
        //             let m_ans = [];
               
        //             for (let i = 0; i < moneyLeft.length; i++) {
                     
        //              let ans = await moneyLeft[i]
        //              if(ans[0] !== undefined) {
        //                  m_ans.push(ans[0])
        //              }
        //             }
                    
        //             res.json(m_ans)
                 
            
        //     //     let wealthDb = await Db.connectDb()
        //     //     let userP = await wealthDb.collection(userID).find({name: 'FS'}).sort({name: -1}).limit(1).toArray()
           
        //     //   const {number} = userP[0]
                
        //     //  let cursor =  wealthDb.collection(userID).find({budg: {$exists: true}}).sort({_id: -1}).limit(number).toArray()
        
        //     //  let mRes = await cursor
        
             
        //     //   res.json(mRes) 
         
        //     }
        
        //     catch(e) {
        //         console.log(e.message)
        //         if(e.message === "Cannot read property 'map' of undefined") {
        
        //             return res.json({e: 'no entry'})
        //         } 
        
        //     }
        // }
        //  else res.json({err: 'you are not logged in'})
    }, 1000);
}

exports.modifyDb = async (req, res) => {
    const {userID, loginStr} = req.params
    giveModel(userID).find({name: "bodyPay"}).exec((err, resDoc) => {
        if(!err) {
            let dbLoginStr = resDoc.map(s => s.loginString)
            if(dbLoginStr[0] === loginStr) {
                try {
                   giveModel(userID).insertMany(req.body, (err, resDoc) => {
                       if(!err) {
                        res.json({status: 'successfull'})

                       } else res.json({errror: 'A technical error occured pls retry'})
                   }) 
                }
                 catch (error) {
                    res.json({errror: 'A technical error occured pls retry'}) 
                }
            } else res.json({error: 'User not logged in'})
        } else res.json({errror: 'A technical error occured pls retry'})
    })
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
     //   const wealthDb = await Db.connectDb()
      let pastS = today - 7
    
           if(pastS > 0) {
    
            try {
               giveModel(userID).find({month:currMth, dayNo: {$lte: today, $gte: pastS}}, (err, resDoc) => {
                //    console.log(resDoc)
                    res.send(resDoc)
               }) 
                
            } 
            
            catch (error) {
                return res.send(error)
            }
         }
         if(pastS === 0) {
            try {
                giveModel(userID).find({month:currMth, dayNo: {$lte: today, $gte: 1}}, (err, resDoc) => {
                    res.send(resDoc)
                }) 
            } 
            catch (error) {
                res.send(error)
            }
         }
         if(pastS < 0) {
             let monthUIArr 
            try {
               giveModel(userID).find({month:currMth, dayNo: {$lte: today, $gte: 1}}, (err, resDoc) => {
                if(!err) {
                    let emptyArr = []
                       emptyArr.push(resDoc)
    
 
                        giveModel(userID).find({month:pMonthV, dayNo: {$lte: maxDayPMonth, $gte: maxDayPMonth + pastS}}, (err, resDoc) => {
                        if(!err) {
                         res.send([...emptyArr[0], ...resDoc])
                        } else res.json({error: 'A technical error occured pls refresh page'})
                        }) 

                }
                }) 
    
     
                 
                
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

 
    try {
       giveModel(userID).find({month: currMonth, year: currYear }, (err, resDoc) => {
         if(!err)  res.send(resDoc)
       }) 
       
     }
    catch (error) {
        res.json({error: 'unsuccessfull'})
    }


  

}

exports.daily = async (req, res) => {
    const {userID} = req.params
 
    let today = Number( new Date().toDateString().substring(7,10).trim()) 
 try {
    giveModel(userID).find({ dayNo: today }, (err, resDoc) => {
        if(!err) res.json({dailyRecs: resDoc})
        else     res.json({dailyRecs: ['No daily records']})

    })
   
   
} catch (error) {

    res.json({dailyRecs: ['No daily records']})
}  
}

 