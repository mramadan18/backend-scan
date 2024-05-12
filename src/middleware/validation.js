import joi from 'joi'
import { Types } from 'mongoose';

const validateObjectId = (value, helper) => {

    return Types.ObjectId.isValid(value) ? true : helper.message('please enter valid _id')
}



export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required(),
    id: joi.string().custom(validateObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()
    })
}

export const validation = (schema) => {
    return (req, res, next) => {
        const requestData = {
            ...req.body,
            ...req.query,
            ...req.params,
        }
        if (req.file || req.files) requestData.file = req.file || req.files
        const validationResult = schema.validate(requestData, {
            abortEarly: false
        })
        if (validationResult?.error) {
            return res.status(400).json({ message: "Validation Error", Errors: validationResult.error.details })
        }
        next()
    }
}
