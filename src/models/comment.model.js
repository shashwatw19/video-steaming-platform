import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        maxlength : 500,
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    tweet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tweet',
    },
    video : {
        type : mongoose.SChema.Types.ObjectId,
        ref : 'Video'
    }
},{timestamps : true})

export const Comment = mongoose.model('comment', commentSchema)