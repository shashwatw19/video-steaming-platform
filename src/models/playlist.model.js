import mongoose from 'mongoose'

const playListSchema  = new mongoose.Schema({
    name : {
        type : true,
        required : true
    },
    description : {
        type : String
    },
    videos : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ],
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
},{timestamps : true})

export const Playlist = mongoose.model('playlist', playListSchema)