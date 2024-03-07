const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken');
const { timeStamp } = require('console');

const userSchema = new Schema( 
    {
        name:{
            require:[true, 'user Name is required'],
            minLength: [5,'Name must be at least 5 characters long'],
            maxLength: [50, 'Name must not be more than 50 characters'],
            type: String,
            trim: true
        },
        email:{
            type: String,
            require:[ true, 'Email is required'],
            unique: true,
            lowercase: true,
            unique: [true, 'This email is already registered'],
        },
        password:{
            type: String,
            select:false
        },
        forgotPasswordToken:{
            type:String
        },
        forgotPasswordExpiryDate:{
            type: Date
        },
    },
    {timestamps: true}
)

// hash password before saving to the database
userSchema.pre('save', async function(next) {
    // if password is not modified then move to the next middleware
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,10);
    return next()
})

// fit check if these method are working as expected
userSchema.method = {
    // method for generating the jsonwebtoken jwt
    jwtToken(){
        return JWT.sign(
               {id: this._id, email: this.email}, 
               process.env.SECRET,
               {expiresIn:'24h'}  
               )
    },
    // userschema method for generating and return forgotpassword token
    getForgotPasswordToken() {
        const forgotToken = crypto.randomBytes(20).toString('hex')
        // step 1- save to database
        this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
        // step 2- forgot passwor expiry date
        this.forgotPasswordToken = Date.now() + 20 * 60 * 1000
        // return the token
        return forgotToken
    }
}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel