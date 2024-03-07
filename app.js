const express = require('express')
const app = express()

const databaseconnect = require('./config/databaseCongfig')
const authRouter = require('./router/authRoute')
//connecting to database
databaseconnect()
app.use(express.json()) // for parsing application json
app.use('/api/auth', authRouter)
module.exports = app
