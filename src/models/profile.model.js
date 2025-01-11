import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
    bio : {
        type : String,
        required : true,
        trim : true,
        maxLength : 500
    },
    social : {
        youtube : {
            type : String,
            trim : true
        },
        twitter : {
            type : String,
            trim : true
        },
        facebook : {
            type : String,
            trim : true
        },
        linkedin : {
            type : String,
            trim : true
        },
        instagram : {
            type : String,
            trim : true
        }
    },
    joinedOn : {
        type : Date,
        default : Date.now()
    },
    gender : {
        type : String
    },
    channel : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Channel'
        }
    ]
    
},
{timeStamps : true})

export const Profile = mongoose.model('profile' , profileSchema)
