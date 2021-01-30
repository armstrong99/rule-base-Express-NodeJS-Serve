require("dotenv").config();
const xpS = require("./index"); //this is the express server

async function run() {
  try {
    // console.log("me running in run")
    xpS();
  } catch (err) {
    //  console.log(err);
  }
}

module.exports = run();
