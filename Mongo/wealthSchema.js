let mongoose = require('mongoose')
 
const wealthSchema = new mongoose.Schema({
_id: {type: Number, default: String},
isVerified: {type: Boolean},
amount: {type: Number},
confirmID: {type: String, trim: true},
name: {type: String, trim: true},
datePaid: {type: Date},
refID: {type: String, trim: true},
password: {type: String, default: Boolean},
budg: {type: String, trim: true},
rPerc: {type: Number, trim: true},
updated: {type: Boolean},
money: {type: Number},
color: {type: String},
diff: {type: Number},
day: {type: String, default: Number},
dayNo: {type:Number, default: String},
month: {type: String, default: Number},
year: {type: Number, default: String},
timeTrans: {type: String, default: Number},
spendBol: {type: Boolean},
recivBol: {type: Boolean},
updated: {type: Boolean},
purpose: {type: String},
loginString: {type: String},
loginState: {type: String},
fsKeys: {type: Array},
number: {type: Number},
 
})

module.exports = wealthSchema