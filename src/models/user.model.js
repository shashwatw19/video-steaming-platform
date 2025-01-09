import mongoose from "mongoose";

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


userSchema.pre('save' , async(next)=>{
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password , 10)

    next()
})

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.method.generateAccessToken = async()=>{
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

userSchema.method.generateRefreshToken = async()=>{
    const payload = {
        _id : this._id,
        
    }
    try{
        return await jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET , {expiresIn : `${process.env.REFRESH_TOKEN_EXPIRY}`})
    
    }catch(err){
        console.log('error while creating refresh token' , err)
    }
}
export const User = mongoose.model('user', userSchema)