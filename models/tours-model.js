const mongoose = require('mongoose')

const TourSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:[true,'name is required']
    },
    price: Number,
    rating: Number
})
const Tour = mongoose.model('Tour',TourSchema)

module.exports = Tour