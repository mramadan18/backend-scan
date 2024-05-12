import * as controllers from './appointment.controller.js'
import auth from "../../middleware/authUser.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { Router } from 'express';
import { validation } from '../../middleware/validation.js';
import * as validaters from './appointment.validation.js'
import authDoctor from '../../middleware/authDoctor.js';

const router = Router()


router.post('/',auth(),validation(validaters.bookAppointment),asyncHandler(controllers.bookAppointment))


router.patch('/',auth(),validation(validaters.updateAppointmentDate),asyncHandler(controllers.updateAppointmentDate))


router.patch('/:appointmentId/cancel',authDoctor(),asyncHandler(controllers.cancelAppointment) )
// router.get('/',authDoctor(),asyncHandler(controllers.getAppointment))


export default router