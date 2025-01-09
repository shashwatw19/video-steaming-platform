import mongoose from "mongoose";
const videoSChema = new mongoose.Schema({
    videoUser : {
        type : String,
        required : [true , 'Video User is required']
    },
    title : {
        type : String,
        required : [true , 'Title is required']
    },
    description : {
        type : String,
        required : [true , 'Description is required']
    },
    duration : {
        type : Number,
        required : true
    },
    views : {
        type : Number,
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    contentType : {
        type : Enum['public', 'membersOnly'],
    }
}, { timestamps: true });

export const Video = mongoose.model("Video", videoSChema);