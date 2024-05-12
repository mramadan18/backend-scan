import DoctorModel from "../../DB/model/Doctor.model.js";
import { tokenDecode } from "../utils/GenerateAndVerifyToken.js";
import { BEARER_KEY } from "../../config/config.js";



const authDoctor =  () => {
    return async(req,res,next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return next(new Error("please login first", { cause: 400 }))
            }
            if (!authorization?.startsWith(BEARER_KEY)) {
                return next(new Error("In-valid bearer key", { cause: 400 }))
            }
            const token = authorization.split(BEARER_KEY)[1]
          
            if (!token) {
                return next(new Error("In-valid token", { cause: 400 }))
            }
    
            const decoded = tokenDecode({ payload: token })
            if (!decoded?._id) {
                return next(new Error("In-valid token payload", { cause: 400 }))

            }
            const authUser = await DoctorModel.findById(decoded._id).select('firstName email role changePassword')
            if (!authUser) {
                return next(new Error("Not register account"), { cause: 400 })
            }
            if (decoded.iat < authUser.changePassword / 1000) {
                return next(new Error("token expired , please login again"), { cause: 400 })
            }
            req.user = authUser;
            return next()
        } catch (error) {
            return res.json({ message: "Catch error", err: error?.message })
        }
    }
}

export default authDoctor