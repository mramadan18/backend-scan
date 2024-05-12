import appointmentModel from "../../../DB/model/Appointment.model.js";
import DoctorModel from "../../../DB/model/Doctor.model.js";
import userModel from "../../../DB/model/User.model.js";
import sendEmail from "../../utils/sendEmail.js"
import moment from "moment/moment.js"


export const bookAppointment = async(req,res,next) => {
    const { _id } = req.user;
    const { doctorId, date } = req.body;
    const Doctor = await DoctorModel.findById(doctorId);
    const appointment = await appointmentModel.findOne({doctorId:doctorId})
    
    if(!Doctor){
        return next(new Error('Invalid Doctor',{cause:404}))
    }
    const appointmentDate = moment(new Date(date)).format('YYYY-MM-DD')

    if (!moment(new Date(appointmentDate)).isValid() || moment(new Date(appointmentDate)).isBefore(moment())) {
      // return res.status(400).json({ message: 'Please Enter valid appointment date' });
      return next(new Error('Please Enter valid appointment date', { cause: 400 }));

    }
    if (!Doctor.availableDates || !Array.isArray(Doctor.availableDates)) {
        // return res.status(400).json({ message: 'Doctor does not have available dates' });
        return next(new Error('Doctor does not have available dates', { cause: 400 }));

    }

    const availableDates = Doctor.availableDates.map(appointmentDate => moment(new Date(appointmentDate)).format('YYYY-MM-DD'));
    if (!availableDates.includes(moment(new Date(appointmentDate)).format('YYYY-MM-DD'))) {
    // return res.status(400).json({ message: 'Doctor is not available on the appointment date' });
       return next(new Error('Doctor is not available on the appointment date', { cause: 400 }));

    }
    const existingAppointment = await appointmentModel.findOne({ userId:_id, doctorId, Date : appointmentDate });
    if (existingAppointment) {
      // return res.status(400).json({ message: 'User already has an appointment with the doctor on the appointment date' });
      return next(new Error('User already has an appointment with the doctor on the appointment date', { cause: 400 }));

    }
    const newAppointment = new appointmentModel({ userId : _id, doctorId, Date : appointmentDate });
    await newAppointment.save();
    if(newAppointment){
        await DoctorModel.updateOne({_id:doctorId},{
            $push:{
                appointments:newAppointment._id
            }
        },{
            new :true
        })
    }

    return res.status(201).json({ message: 'Appointment created successfully' });
}



export const cancelAppointment = async(req,res,next) => {
    const {_id} = req.user;
    const doctor = await DoctorModel.findById(_id);
    if (!doctor){
      // return res.status(401).json({ message: 'Not authorized' });
      return next(new Error('Not authorized', { cause: 401 }));

    }

    const appointment = await appointmentModel.findOne({ _id: req.params.appointmentId, doctorId: doctor._id ,isCanceled:false});
    if (!appointment){
      // return res.status(404).json({ message: 'Appointment not found' });
      return next(new Error('Appointment not found', { cause: 404 }));

    }

    appointment.isCanceled = true;
    await appointment.save();
    

    const user = await userModel.findById(appointment.userId);
    if(appointment.isCanceled){
        const message = `Your appointment with Dr. ${doctor.firstName} ${doctor.lastName} on ${moment(appointment.date).format('YYYY-MM-DD')} has been cancelled.`
        const sentEmail = await sendEmail({
            to: user.email,
            message,
            subject: 'Appointment Cancellation'
        })
        if (!sentEmail) {
            return next(new Error('Send Email Service Fails', { cause: 400 }))
        }
    }
    return res.status(201).json({ message: 'Appointment cancelled successfully' });

}



// export const getAppointment = async(req,res,next) =>{
//     const {_id} = req.user;
//     const doctor = await DoctorModel.findById({_id})
//     if(!doctor){
//         return next(new Error('Invalid Doctor',{cause:404}))
//     }

//     const appointments = await appointmentModel.find({doctorId:doctor._id,isCanceled:false}).populate('userId')
//     if(!appointments.length){
//         return next(new Error('There Is no appointment for you doctor', { cause: 404 }))

//     }
//    return res.status(200).json(appointments); 
// }



export const updateAppointmentDate = async(req, res, next) => {
  const { _id } = req.user;
  const { appointmentId, newDate } = req.body;
  const user = await userModel.findById(_id)

  const existingAppointment = await appointmentModel.findOne({ _id: appointmentId });
  if (!existingAppointment) {
    return next(new Error('Appointment not found', { cause: 404 }));
  }

  const doctor = await DoctorModel.findById(existingAppointment.doctorId);
  if (!doctor) {
    return next(new Error('Doctor not found', { cause: 404 }));
  }

  const newAppointmentDate = moment(new Date(newDate)).format('YYYY-MM-DD');
  if (!moment(new Date(newAppointmentDate)).isValid() || moment(new Date(newAppointmentDate)).isBefore(moment())) {
    // return res.status(400).json({ message: 'Please enter a valid appointment date' });
    return next(new Error('Please enter a valid appointment date', { cause: 400 }));

  }
  const availableDates = doctor.availableDates.map(newAppointmentDate => moment(new Date(newAppointmentDate)).format('YYYY-MM-DD'));
  if (!availableDates.includes(moment(new Date(newAppointmentDate)).format('YYYY-MM-DD'))) {
  // return res.status(400).json({ message: 'Doctor is not available on the appointment date' });
  return next(new Error('Doctor is not available on the appointment date', { cause: 400 }));

  }
  const existingAppointmentOnNewDate = await appointmentModel.findOne({ doctorId: doctor._id, Date: newAppointmentDate });
  if (existingAppointmentOnNewDate) {
    // return res.status(400).json({ message: 'The doctor already has an appointment on the new date' });
    return next(new Error('The doctor already has an appointment on the new date', { cause: 400 }));

  }

  existingAppointment.Date = newAppointmentDate;
  await existingAppointment.save();
   

  const message = `Dear Dr. ${doctor.firstName},\n\nThis is to inform you that the appointment with ${user.firstName} has been updated to ${newAppointmentDate}.\n\nBest regards,\nYour Clinic`;
  const sentEmail = await sendEmail({
    to: doctor.email,
    message,
    subject: 'Appointment Update'
})
if (!sentEmail) {
    return next(new Error('Send Email Service Fails', { cause: 400 }))
}
  return res.status(200).json({ message: 'Appointment updated successfully' });
};
