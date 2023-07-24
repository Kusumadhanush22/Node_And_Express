const jwt = require('jsonwebtoken')
const User = require('../models/users-model');
const catchAsync = require('../utils/catch-async');

module.exports.signup = catchAsync(async (req,res,next) => {
    const newUser = await User.create(req.body)
    const token = jwt.sign({id:newUser._id})
    res.status(201).json({
        status:"sucess",
        data:{
            user:newUser
        }
    })
})