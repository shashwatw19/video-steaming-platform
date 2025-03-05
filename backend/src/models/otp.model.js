import mongoose from 'mongoose'
import { mailSender } from '../utils/mailSender.js'
import { emailVerficationTemplate } from '../mail/template/emailVerficationTemplate.js'
const otpSchema = new mongoose.Schema({
    otp : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : Date.now() + 5 * 60 * 1000    //this document will automatically be deleted after 5 mins of its creation time
    }
},{timestamps:true})


const sendVerificationEmail = async(email , otp)=>{
    try{
        const mailResponse = await mailSender(email , 'Verfication Mail' , otp)
        console.log('verification mail sent successfully' , mailResponse)
    }catch(err){
        console.log('error while sending verifcation mail' , err.message)
    }
}

otpSchema.pre('save', async function (next){
    if(this.isNew){
        console.log(this.otp)
        await sendVerificationEmail(this.email , emailVerficationTemplate(this.otp))
    }
        
    next()
})

otpSchema.methods.generateOtp = async function(){
    const otp = Math.floor(100000 + Math.random() * 900000)
    return otp
}
export const Otp = mongoose.model('otp' , otpSchema)
