const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
{
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    phone:{
        type:String,
        required:true
    },

    specialization:{
        type:String,
        required:true
    },

    experience:{
        type:Number,
        required:true
    },

    salary:{
        type:Number,
        required:true
    },

    joiningDate:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        default:"Active"
    }

},
{timestamps:true}
);

module.exports = mongoose.model("Trainer", trainerSchema);