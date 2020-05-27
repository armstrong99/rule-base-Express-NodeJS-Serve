const {MongoClient} = require('mongodb')


exports.main = async () => {
  
const client = new MongoClient()

const url = 'mongodb://localhost:27017/wealthDb'  
try {

     let mongoDb =  await client.connect(url, (err, db) => {
           
   if(err) {
       throw err
   }
   else {
       db.close()
       return mongoDb.db()
   }
        })
   }
   
catch(e) {
   
   } 
   
finally {
   client.close()
   }
   
   
}

 