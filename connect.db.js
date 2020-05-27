const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017/wealthDb';
let db;

exports.connectDb = async () => {
    let client = await MongoClient.connect(url, ({ useNewUrlParser: true, useUnifiedTopology: true  }))
    db = client.db();
    return db;
}





