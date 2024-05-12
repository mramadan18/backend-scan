import DoctorModel from "../../../DB/model/Doctor.model.js";
import userModel from "../../../DB/model/User.model.js";
import cloudinary from "../../utils/cloudinary.js";
import sendEmail from "../../utils/sendEmail.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { PROJECT_FOLDER } from "../../../config/config.js";
import axios from "axios";

export const uploadPhoto = async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  if (!req.files || req.files.length === 0) {
    return next(new Error("Please select an image"), { cause: 400 });
  }
  const maxUploads = 5;
  if (req.files.length > maxUploads) {
    return next(
      new Error(`Maximum of ${maxUploads} images can be uploaded`, {
        cause: 400,
      })
    );
  }
  let imageArr = [];
  let publicIdArr = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${PROJECT_FOLDER}/Patients/${user.firstName} ${user.lastName}`,
      }
    );
    imageArr.push(secure_url);
    publicIdArr.push(public_id);
    // save the uploaded image to the user's images array in the database
    user.images.push(secure_url);
    user.publicIDs.push(public_id);
  }
  await user.save();

  const doctors = await DoctorModel.find({
    address: user.address,
    role: systemRoles.DOCTOR,
  });
  if (!doctors.length) {
    return next(
      new Error("No doctors found with the same address as the user", {
        cause: 404,
      })
    );
  }

  const message = `New patient photos have been uploaded by ${user.firstName} ${
    user.lastName
  }.<br><br>${imageArr
    .map((image) => `<img src="${image}" style="max-width: 100%;">`)
    .join("<br><br>")}`;
  const sentEmail = await sendEmail({
    to: doctors.map((doctor) => doctor.email),
    message,
    subject: "New Patient Photos",
  });
  if (!sentEmail) {
    return next(new Error("Send Email Service Fails", { cause: 400 }));
  }
  res
    .status(201)
    .json({ message: "Photos uploaded and sent to doctors", user });

  // res.status(201).json({ message: 'Done', user });
};

export const searchDoctor = async (req, res) => {
  const { name } = req.body;
  const pattern = new RegExp(`${name}`, "i");
  const doctors = await DoctorModel.find({
    $or: [
      { firstName: { $regex: pattern } },
      { lastName: { $regex: pattern } },
      { address: { $regex: pattern } },
    ],
  }).select("-password -otp -otpExpire");

  if (!doctors.length) {
    return res.status(404).json({ message: "There is no doctors" });
  }
  res.status(200).json({ message: "Done", doctors });
};

export const getAllDoctors = async (req, res) => {
  const doctors = await DoctorModel.find()
    .select("firstName lastName phone email availableDates")
    .populate([
      {
        path: "Appointments",
      },
    ]);
  if (!doctors.length) {
    res.status(404).json({ message: "There is no doctors" });
  }
  res.status(200).json({ message: "Done", doctors });
};

export const uploadPhotoAndAnaylsis = async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  if (!req.files || req.files.length === 0) {
    return next(new Error("Please select an image"), { cause: 400 });
  }
  const maxUploads = 5;
  if (user.images.length + req.files.length > maxUploads) {
    return next(
      new Error(`Maximum of ${maxUploads} images can be uploaded`, {
        cause: 400,
      })
    );
  }
  let imageArr = [];
  let publicIdArr = [];
  let secureUrl;

  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${PROJECT_FOLDER}/Patients/${user.firstName} ${user.lastName}`,
      }
    );

    imageArr.push(secure_url);
    publicIdArr.push(public_id);
    // save the uploaded image to the user's images array in the database
    user.images.push(secure_url);
    user.publicIDs.push(public_id);
    secureUrl = secure_url;
  }
  await user.save();

  // Send request to machine API
  // const machineApiUrl =
  // "https://brain-image-classification-model.onrender.com/analyze";

  const machineApiUrl = "http://127.0.0.1:8000/predict";
  const imagePaths = imageArr.map((image, index) => {
    return {
      path: secureUrl,
      publicId: publicIdArr[index],
    };
  });

  const requestBody = {
    images: imagePaths,
  };

  try {
    const machineApiResponse = await axios.post(machineApiUrl, requestBody);
    const analysisResult = machineApiResponse.data;
    // Update user's data with analysis result
    user.analysisResult = analysisResult;
    await user.save();

    // Return response to user with analysis result
    res
      .status(201)
      .json({ message: "Photos uploaded and analyzed", analysisResult });
  } catch (error) {
    console.log(error);
    return next(new Error("Error analyzing photos", { cause: 500 }));
  }
};
