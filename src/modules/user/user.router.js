import { Router } from "express";
import auth from "../../middleware/authUser.js";
import { fileUpload } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";

import * as controllers from "./user.controllers.js";
import { validation } from "../../middleware/validation.js";
import * as validaters from "./user.validation.js";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "User Module" });
});

router.post(
  "/upload",
  auth(),
  fileUpload({}).array("image"),
  validation(validaters.uploadPhoto),
  asyncHandler(controllers.uploadPhoto)
);
router.post(
  "/scan/upload",
  auth(),
  fileUpload({}).array("image"),
  // (req, res, next) => {
  //   return res.json("hello");
  // }
  validation(validaters.uploadPhoto),
  asyncHandler(controllers.uploadPhotoAndAnaylsis)
);

router.get("/search", auth(), asyncHandler(controllers.searchDoctor));

router.get("/doctors", auth(), asyncHandler(controllers.getAllDoctors));

export default router;
