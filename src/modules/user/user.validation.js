import Joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const uploadPhoto = Joi.object({
    file : Joi.array().items(generalFields.file.required()).required()
   
}).required()