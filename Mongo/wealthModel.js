let mongoose = require('mongoose');
let wealthShema = require('./wealthSchema');

const createUserModel = (userID, inStance) => {
    let model = mongoose.model(userID, wealthShema)

    return new model(inStance)
};

const giveModel = userID => mongoose.model(userID, wealthShema);


module.exports = {createUserModel, giveModel}