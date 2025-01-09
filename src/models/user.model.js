import mongoose, { Mongoose } from "mongoose";

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
        default : '../public/images/default_cover.png'
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
    resetPasswordExpire : {
        type : Date
    },
    password : {
        type : String,
        required : [true , 'Password is required']
    },

},{timestamps : true})

export const User = mongoose.model('user', userSchema)