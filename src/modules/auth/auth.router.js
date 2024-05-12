import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as controllers from './auth.controllers.js'
import { logInSchema, signUpSchema } from "./auth.validation.js";
const router = Router()




router.post('/signUp', validation(signUpSchema), asyncHandler(controllers.signUp))
router.get('/confirmEmail/:token', asyncHandler(controllers.confirmEmail))

router.post('/login', validation(logInSchema), asyncHandler(controllers.login))
router.get('/sendcode', asyncHandler(controllers.sendCode))
router.put('/resetPassword', asyncHandler(controllers.resetPassword))
router.put('/resetPass', asyncHandler(controllers.resetPass))

export default router