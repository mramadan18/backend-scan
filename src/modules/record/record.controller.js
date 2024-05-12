import DoctorModel from "../../../DB/model/Doctor.model.js";
import recordModel from "../../../DB/model/Record.model.js";
import userModel from "../../../DB/model/User.model.js";
import moment from "moment";


export const addRecord = async(req,res,next) => {
    const {_id} = req.user;
    const {userId} = req.params
    const { diagnosis, treatment } = req.body;

    const patient = await userModel.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    const today = moment().startOf('day');
    const existingRecord = await recordModel.findOne({
      doctorId: _id,
      userId,
      createdAt: { $gte: today },
    });
    if (existingRecord) {
      return res.status(400).json({
        message: 'A record has already been added for this patient today',
      });
    }
    const record = new recordModel({
        userId,
        doctorId:_id,
        diagnosis,
        treatment,
      });

      await record.save();
      if(record){
       const user = await userModel.findById({_id:userId})
       user.record = record._id
       await user.save()
      }
      res.status(201).json({ message: 'Record added successfully', record });
}


export const updateRecord = async(req,res,next) => {
    const {_id} = req.user;
    const {userId} = req.params
    
        
    const record = await recordModel.findOne({ userId: userId });
    if (!record) {      
      return next(new Error('Record not found', { cause: 400 }))
    }
    if (req.body.diagnosis) {
      record.diagnosis = req.body.diagnosis;
    }
    if(req.body.treatment){
      record.treatment = req.body.treatment;
    }

    if (!Object.keys(req.body).length) {
      return next(new Error('please enter the updated fields', { cause: 400 }))
  }
  

    // Update user record
    record.updatedBy = _id
    await record.save();
    res.status(200).json({ message: 'User record updated successfully' });

}

export const getRecord = async(req,res,next) => {
    const {id} = req.params;

    // Check if the record exists
    const record = await recordModel.findById(id).populate('userId doctorId');
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
  
    // Return the record
    res.status(200).json({message: "Done",record});
} 