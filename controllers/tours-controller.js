const AppErrors = require('../utils/appErrors')
const Tour = require('./../models/tours-model')
const catchAsync = require('../utils/catch-async');
exports.getAllTours = catchAsync (async (req,res,next) => {
    const reqQuery = {...req.query}
    const fields = ['page','sort', 'limit', 'fields']
    fields.forEach((item) => delete reqQuery[item])
    console.log(reqQuery)
    let tours, query;
    if(Object.keys(reqQuery).length > 0) {
        // let queryString = JSON.stringify(reqQuery)
        // queryString = queryString.replace(/\bgte|gt|lte|lt|\b/g, match => `$${match}`)
        // console.log(JSON.parse(queryString))
        query =  Tour.find(reqQuery)
    } else {
        query =  Tour.find()
    }
    if (req.query.sort) {
        console.log(req.query)
        query = query.sort({rating})
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    }
    tours = await query;
    res.status(200).json({
        status:'success',
        results: tours.length,
        data:{
            tours
        }
    })
})
exports.postTour = catchAsync(async (req, res, next) => {
    // console.log(req.query)
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status:'success',
        data:{
            tour:newTour
        } 
    })
})
exports.getTour = catchAsync(async(req, res,next) => {
    const {id} = req.params;
    console.log(id)
    const tour = await Tour.findById(id).catch(err=>console.log(err))
    console.log(tour);
    // console.log(tour);
    if(!tour) {
        return next(new AppErrors(404, 'No tour found with that ID'))
    }
    res.status(200).json({
        status:'success',
        data:{
            tour
            }
    })    
})

exports.updateTour = catchAsync(async (req, res,next) => {
    const {id} = req.params;
    console.log(req.body)
    const tour = await Tour.findByIdAndUpdate(id,req.body,{new:true, runValidators:true}) 
    res.status(204).json({
        status:'success',
        data:{
            tour
        }
    })
})
exports.deleteTour = catchAsync(async (req,res,next) => {
    const {id} = req.params;
    await Tour.findByIdAndDelete(id)
    res.status(204).json({
        status:'sucess',
        data:null
    })    
})