const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/users-model');
const catchAsync = require('../utils/catch-async');
const AppErrors = require('../utils/appErrors');
const sendEmail = require('../utils/email');
const crypto = require('crypto')

// Method used to generate the token
const generateToken = (id) => {
  return jwt.sign({id},process.env.JWT_SECREAT,{
    expiresIn:process.env.JWT_EXPRIES_IN
  })
}

// Method used to validate the token
// const validateToken = (reqToken) => {
//   return jwt.verify(reqToken, process.env.JWT_SECREAT)
// }
const createAndSendToken = (user,statusCode,res) => {
  const token = generateToken(user._id);
    console.log(token)
    res.status(statusCode).json({
        status:"success",
        token,
        data:{
            user:user
        }
    })
}
module.exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body)
    createAndSendToken(newUser,201,res);
})

module.exports.login = catchAsync(async (req,res,next) => {
  //Fetching email and password from request body
  const {email,password} = req.body;
  // Validating the email and password
  if (!email || !password) {
    return next(new AppErrors(400,'Invalid User! Please enter valid email and password'))
  }
  // Fecthing the user with corresponding email (Select is because by default our payload doesn't give password)
  const user = await User.findOne({email}).select('+password')
  // Verifing wheather token is valid or not
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppErrors(401,'Incorrect Email or Password'))
  }
  createAndSendToken(user,200,res);
  const token = generateToken(user._id)
})
module.exports.protect = catchAsync(async (req,res,next) => {
  let token;
  //Fetching the token from the request headers
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  console.log(token);
  //Validating the token
  // validateToken(token)
  const decrypt = await promisify(jwt.verify)(token,process.env.JWT_SECREAT)
  console.log(decrypt)
  if(!token || !decrypt) {
    return next(new AppErrors(401,'UnAuthorized Request'))
  }
  const freshUser = await User.findById(decrypt.id);
  req.freshUser = freshUser;
  next();
})
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.freshUser.role)) {
      return next(
        new AppErrors(403,'You do not have permission to perform this action')
      );
    }

    next();
  };
};
exports.forgotPassword = catchAsync(async (req,res,next) => {
  const {email = ''} = req?.body ?? {};
  const user = await User.findOne({email})
  if(!user) {
    return next(
      new AppErrors(404,'There is no user with mentioned email address')
    );
  }
  const resetPasswordToken =  await user.createPasswordToken();
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users//resetpassword/${resetPasswordToken}`
  user.save({validateBeforeSave:false});
  try{
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
    await sendEmail({
      email,
      subject:'Your Password reset token it will expires in 10 mins',
      message
    })
    res.status(200).json({
      status:"success",
      message:"Reset Password Email is sent to registered email address"
    })
  } catch(err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({validateBeforeSave:false})
    return next(new AppErrors(500,'There was an error while sending an error please try later'))
  }
  
})
exports.resetPassword = catchAsync(async (req,res,next) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({passwordResetToken:resetToken,passwordResetTokenExpiration:{
    $gt:Date.now()
  }});
  if (!user) {
    next(new AppErrors(400,'Token is invalid! or has expired!'))
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined
  user.passwordResetTokenExpiration = undefined;
  await user.save({validateBeforeSave:false})
  createAndSendToken(user,200,res);
  
  next();
})
exports.updatePassword = catchAsync(async (req, res, next)=> {
  const {email='',password='',confirmPassword='', existingPassword=''} = req.body;
  const user = await User.findOne({email}).select('+password');
  if(!user) {
    return next(new AppErrors(404,"No User found specified email address"))
  }
  const correct = await user.correctPassword(existingPassword, user.password);
  if(!correct) {
    return next(new AppErrors(401,"Incorrect Existing password"))
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  await user.save();
  createAndSendToken(user,200,res);
  next();
})