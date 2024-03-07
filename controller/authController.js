const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const emailValidator = require('email-validator')

/*
@signup 
@route = /api/auth/signup
@method = POST
@access = public
@description = sign up a user
@body = name , email , password, confirmPassword
@returns = user object
*/
const signUp = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
  
    ///every filed is required
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }
  
    // vaildate email use nam package "email-validator"
    const validEmail = emailValidator.validate(email)
    if (!validEmail) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Email',
      })
    }
  
    try {
      // send passowrd not match err if password !== confrimpassword
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password not match',
        })
      }
      const userInfo = new userModel(req.body)
      // save the user to the database
      const result = await userInfo.save()
      return res.status(200).json({
        success: true,
        message: 'User Created Successfully',
        data: result,
      })
    } catch (error) {
      // send the message of the email in not quique
  
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        })
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
 /////////////////////////////////////////////////////////////////////////// 
  /**
   * @SIGNIN
   * @route /api/auth/signin
   * @method POST
   * @description verify user and send cookie with jwt token
   * @body email , password
   * @returns User Object , cookie
  */
  
//   const signIn = async (req, res, next) => {
//     const { email, password } = req.body
//     // send response with error message if email or passsword is missing
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and Password are required',
//       })
//     }
  
//     try {
//       //  check user exit or not
//       const user = await userModel.findOne({ email }).select('+password')
  
//       // if user is null or the passowrd is not match then send the error message
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({
//           success: false,
//           message: 'Invalid Email or Password',
//         })
//       }
//       // send the user object and jwt token in cookie
//       const token = user.jwtToken()
//       user.password = undefined
//       const cookieOption = {
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
//         httpOnly: true, // cookie is not accessable by the client
//       }
//       res.cookie('token', token, cookieOption)
//       res.status(200).json({
//         success: true,
//         data: user,
//       })
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       })
//     }
//   }
  
  module.exports = { signUp }
  