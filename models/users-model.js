const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
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
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:8,
        maxlength:25,
        select:false
    },
    passwordChangedAt:Date,
    passwordResetToken:{
        type:String,
        select:false
    },
    passwordResetTokenExpiration:{
        type:Date,
        select:false
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
    this.passwordChangedAt =  Date.now() - 1000;
    next();
})
UserSchema.methods.correctPassword = async function(reqPass, exisPass) {
    return await bcrypt.compare(reqPass,exisPass)
}
UserSchema.methods.passwordChanged = async function() {
    if(this.passwordChangedAt) {
        console.log(this.passwordChangedAt);
    }
    return false
}
UserSchema.methods.createPasswordToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpiration = Date.now() + 10*60*1000;
    console.log(resetToken,this.passwordResetToken)
    return resetToken
}
const User = mongoose.model('User',UserSchema);
module.exports = User