const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:[true,'Email is Required it should be unique'],
        validate:[validator.isEmail,'Email must be valid!']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:8,
        maxlength:25,
    },
    confirmPassword:{
        type:String,
        required:[true,'Confirm Password is mandatory feild'],
        validate:{validator:function(el) {
            return el === this.password
        }}
    }
})

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined
    next();
})
const User = mongoose.model('User',UserSchema);
module.exports = User