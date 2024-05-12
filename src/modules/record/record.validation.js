
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const addRecord = joi.object({
    diagnosis : joi.string().required().min(5).max(20),
    treatment : joi.string().required().min(5).max(20),
    userId : generalFields.id.required(),
    
}).required()


export const updateRecord = joi.object({
    diagnosis : joi.string().optional().min(5).max(20),
    treatment : joi.string().optional().min(5).max(20),
    userId : generalFields.id.required(),
    
}).required()

export const getRecord = joi.object({
    userId : generalFields.id.required(),
}).required()