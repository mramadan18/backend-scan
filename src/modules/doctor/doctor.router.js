import { Router } from "express";
import * as controllers from "./doctor.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validaters from "./doctor.validation.js";
import { fileUpload } from "../../utils/multer.js";
import authDoctor from "../../middleware/authDoctor.js";
const router = Router({ caseSensitive: true });

router.patch(
  "/upload",
  authDoctor(),
  fileUpload({}).single("image"),
  validation(validaters.uploadPhoto),
  asyncHandler(controllers.uploadPhoto)
);
router.put(
  "/updateProfile",
  authDoctor(),
  validation(validaters.updateProfile),
  asyncHandler(controllers.updateDoctor)
);
router.get("/", authDoctor(), asyncHandler(controllers.getAppointment));
router.get("/Profile", authDoctor(), asyncHandler(controllers.getProfile));
router.get("/Doctors", authDoctor(), asyncHandler(controllers.getDoctors));

export default router;
