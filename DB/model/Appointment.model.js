import mongoose, { Schema, model } from "mongoose";




const appointmentSchema  = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required : true
    },
    Date:{
        type:String,
        required:true
    },
    isCanceled:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const appointmentModel = mongoose.models.Appointment || model('Appointment', appointmentSchema )

export default appointmentModel