import mongoose from "mongoose";
const videoSChema = new mongoose.Schema({
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
        default  : 0
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
    },
    videoUrl : {
        type : String,
        required : true
    }
}, { timestamps: true });

export const Video = mongoose.model("Video", videoSChema);