import mongoose from "mongoose";
import {mailSender} from '../utils/mailSender.js'
import crypto from 'crypto'
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        lowerCase : true,
        trim : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        lowerCase : true,
        trim : true,
        unique : true
    },
    avatar : {
        type : String,
        required : true,
      
    },
    coverImage : {
        type : String,
        required : true,
       
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Video'
        }
    ],
    refreshToken : {
        type : String,
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    },
    password : {
        type : String,
        required : [true , 'Password is required']
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Profile'
    }

},{timestamps : true})


userSchema.pre('save' , async(next)=>{
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password , 10)

    next()
})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = async function(){
    const payload = {
        _id : this._id,
        email : this.email,
        username : this.username
    }
    try{
        return await jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET , {expiresIn : `${process.env.ACCESS_TOKEN_EXPIRY}`})
    
    }catch(err){
        console.log('error while creating access token ' , err)
    }
}

userSchema.methods.generateRefreshToken = async function(){
    const payload = {
        _id : this._id,
        
    }
    try{
        return await jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET , {expiresIn : `${process.env.REFRESH_TOKEN_EXPIRY}`})
    
    }catch(err){
        console.log('error while creating refresh token' , err)
    }
}

userSchema.methods.generateResetPasswordToken = function(){
    
    try {
        const resetToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
        return resetToken;
    }catch (error) {
        console.log('Error while creating reset password token' , error)
        
    }
};

userSchema.pre('save' , async(next)=>{
    
    if(this.isModified('resetPasswordToken'))
        await mailSender(this.email , 'Reset Password' , `Click on the link to reset password http://localhost:3000/resetpassword/${this.resetPasswordToken}`)
    
    next()
})

export const User = mongoose.model('user', userSchema)


