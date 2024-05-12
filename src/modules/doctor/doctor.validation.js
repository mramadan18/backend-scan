
import joi  from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const uploadPhoto = joi.object({
    file : generalFields.file.required()
}).required()


export const updateProfile = joi.object({
    firstName:joi.string().max(15).min(5).optional(),
    lastName :joi.string().max(15).min(5).optional(),
    email :generalFields.email.optional(),
    availableDates : joi.array().items(joi.string()).optional(),
    // file : generalFields.file.optional(),
    address : joi.string().optional()
    // doctorId:joi.string().required()
})
