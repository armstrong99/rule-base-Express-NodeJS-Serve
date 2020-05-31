require('dotenv').config()
let mongoose = require ("mongoose");
const xpS = require('./index') //this is the express server

// const { MongoClient } = require("mongodb");
const url = process.env.DB_KEY

// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });
 
// const dbName = "Iamwealthy";
                      
 async function run() {
    try {
         mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  },(err, res) => {
             try {
                 
                 if(err) {
                    throw new Error('Error connecting to ', url, '.', ' ', err)
                 }
                 else {
                     console.log('Success conncecting to ', url)
                     xpS()
                 }
             } catch (error) {
                 console.log(error)
             }
         })
         
         }
         catch (err) {
         
        console.log(err);
     }
  
}

 
module.exports = run();










 



