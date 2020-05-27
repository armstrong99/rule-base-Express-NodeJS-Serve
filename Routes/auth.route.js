const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())

 const authRouter = express.Router();

 let authController = require('../Controllers/auth.controller')

 authRouter.post('/login/newUser/:refID', authController.login_New_User)
 authRouter.post('/login/oldUser/', authController.login_Old_User)
 authRouter.get('/logout/:userID', authController.logOut)

 module.exports = authRouter

