const mongoose = require('mongoose')
const MONGODB_URL = process.env.MONGODB_URL 

const databaseconnect = () => {
    mongoose.connect(MONGODB_URL)
    .then(() => console.log('Database connected successfully' ))
    .catch(err => console.log(err))
}

module.exports = databaseconnect