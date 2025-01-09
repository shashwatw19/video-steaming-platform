import mongoose from 'mongoose'

const tweetSchema = new mongoose.Schema({
    content : {
        type : String,
        maxlength : 5000,
        required : true,
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    imageUrls : [
        {
            type : String
        }
    ],
},{timestamps : true})

export const Tweet = mongoose.model('tweet', tweetSchema)