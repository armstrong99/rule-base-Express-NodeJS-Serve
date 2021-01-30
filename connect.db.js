require('dotenv').config()
let mongoose = require ("mongoose");
const xpS = require('./index') //this is the express server

// const { MongoClient } = require("mongodb");

const url = 'mongodb://localhost:27017/myapp'

// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });
 
   console.log("me running")                   
 async function run() {
    try {
   console.log("me running in run")                   
                             xpS()
//this is a minimal application, hence remove the MONGODB API and use runtiome memory to prototype


        //  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  },(err, res) => {
        //      try {
                 
        //          if(err) {
        //             throw new Error('Error connecting to ', url, '.', ' ', err)
        //          }
        //          else {
        //              console.log('Success conncecting to ', url)
        //              xpS()
        //          }
        //      } catch (error) {
        //          console.log(error)
        //      }
        //  })
         
         }
         catch (err) {
         
        console.log(err);
     }
  
}

 
module.exports = run();










 



