
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const bookAppointment = joi.object({
    doctorId : generalFields.id.required(),
    date :joi.string().required()
}).required()

export const updateAppointmentDate = joi.object({
    appointmentId : generalFields.id.required(),
    newDate :joi.string().required()
}).required()