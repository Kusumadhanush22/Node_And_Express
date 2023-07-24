const AppErrors = require('../utils/appErrors')
const User = require('./../models/users-model')
const catchAsync = fn => {
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}
exports.getAllUsers = catchAsync (async (req,res,next) => {
    const reqQuery = {...req.query}
    const fields = ['page','sort', 'limit', 'fields']
    fields.forEach((item) => delete reqQuery[item])
    console.log(reqQuery)
    let users = [], query;
    if(Object.keys(reqQuery).length > 0) {
        // let queryString = JSON.stringify(reqQuery)
        // queryString = queryString.replace(/\bgte|gt|lte|lt|\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryString))
        query =  User.find(reqQuery)
    } else {
        query =  User.find()
    }
    if (req.query.sort) {
        console.log(req.query)
        // query = query.sort({rating})
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    }
    users = await query;
    res.status(200).json({
        status:'success',
        results: users.length,
        data:{
            users
        }
    })
})
exports.postUser = catchAsync(async (req, res, next) => {
    // console.log(req.query)
    const newUser = await User.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            user:newUser
        } 
    })
})
exports.getUser = catchAsync(async(req, res,next) => {
    const {id} = req.params;
    console.log(id)
    const user = await User.findById(id).catch(err=>console.log(err))
    console.log(user);
    if(!user) {
        return next(new AppErrors(404, 'No tour found with that ID'))
    }
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })    
})

exports.updateUser = catchAsync(async (req, res,next) => {
    const {id} = req.params;
    console.log(req.body)
    const user = await User.findByIdAndUpdate(id,req.body,{new:true, runValidators:true}) 
    res.status(204).json({
        status:'success',
        data:{
            user
        }
    })
})
exports.deleteUser = catchAsync(async (req,res,next) => {
    const {id} = req.params;
    await User.findByIdAndDelete(id)
    res.status(204).json({
        status:'sucess',
        data:null
    })   
})