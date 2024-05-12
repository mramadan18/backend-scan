import { Router } from "express";
import * as controllers from './record.controller.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validaters from './record.validation.js'
import authDoctor from "../../middleware/authDoctor.js";
const router = Router()

router.post('/addRecord/:userId/',authDoctor(),validation(validaters.addRecord),asyncHandler(controllers.addRecord))
router.put('/:userId',authDoctor(),validation(validaters.updateRecord),asyncHandler(controllers.updateRecord))
router.get('/:id',authDoctor(),validation(validaters.getRecord),asyncHandler(controllers.getRecord))

export default router