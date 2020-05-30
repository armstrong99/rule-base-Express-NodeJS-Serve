let mongoose = require('mongoose')
 
const testSchema = new mongoose.Schema({
_id: {type: String },
isTest: {type: Boolean, required: true},
 
})

module.exports = mongoose.model('IamTest', testSchema)