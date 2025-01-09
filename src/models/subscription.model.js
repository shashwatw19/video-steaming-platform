import mongoose from 'mongoose'

const subScriptionSchema = new mongoose.Schema({
    subscriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{timestamps : true})

export const Subscription = mongoose.model('subscription', subScriptionSchema)