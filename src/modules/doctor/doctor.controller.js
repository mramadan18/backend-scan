import appointmentModel from "../../../DB/model/Appointment.model.js";
import DoctorModel from "../../../DB/model/Doctor.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { PROJECT_FOLDER } from "../../../config/config.js";
import moment from "moment";

export const updateDoctor = async (req, res, next) => {
  const { _id } = req.user;
  const doctor = await DoctorModel.findById(_id);

  // Check if the doctor exists
  if (!doctor) {
    // return res.status(404).json({ message: 'Doctor not found' });
    return next(new Error("Doctor not found", { cause: 404 }));
  }
  // Update the doctor fields
  if (req.body.firstName) {
    doctor.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    doctor.lastName = req.body.lastName;
  }
  if (req.body.email) {
    // Check if the email already exists in the database
    const existingDoctor = await DoctorModel.findOne({ email: req.body.email });
    if (existingDoctor && existingDoctor._id.toString() !== _id) {
      return next(new Error("Email already exists", { cause: 409 }));
    }
    doctor.email = req.body.email;
  }
  if (req.body.availableDates) {
    let array = [];
    for (const i of req.body.availableDates) {
      const fromMoment = moment(new Date(i)).format("YYYY-MM-DD");
      array.push(fromMoment);
    }
    doctor.availableDates = array;
  }
  if (req.body.address) {
    doctor.address = req.body.address;
  }
  if (!Object.keys(req.body).length) {
    return next(new Error("please enter the updated fields", { cause: 400 }));
  }
  // Save the updated doctor object to the database
  await doctor.save();

  // Return the updated doctor object as the response
  return res.status(200).json(doctor);
};

export const uploadPhoto = async (req, res, next) => {
  const { _id } = req.user;
  if (!req.file) {
    return next(new Error("Please upload your image", { cause: 400 }));
  }
  const doctor = await DoctorModel.findById(_id);
  if (!doctor.Image.public_id) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${PROJECT_FOLDER}/Profile/Dr.${doctor.firstName} ${doctor.lastName}`,
      }
    );
    doctor.Image = {
      path: secure_url,
      public_id,
    };
    await doctor.save();
    return res.status(201).json({ message: "Done" });
  }
  const result = await cloudinary.uploader.destroy(doctor.Image.public_id);
  if (result.result !== "ok" && result.result !== "not found") {
    return next(
      new Error("Failed to delete user photo from Cloudinary", { cause: 400 })
    );
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${PROJECT_FOLDER}/Profile/Dr.${doctor.firstName} ${doctor.lastName}`,
    }
  );
  doctor.Image = {
    path: secure_url,
    public_id,
  };
  await doctor.save();
  return res.status(201).json({ message: "Done" });
};

export const getAppointment = async (req, res, next) => {
  const { _id } = req.user;
  const doctor = await DoctorModel.findById({ _id });
  if (!doctor) {
    return next(new Error("Invalid Doctor", { cause: 404 }));
  }

  const appointments = await appointmentModel
    .find({ doctorId: doctor._id, isCanceled: false })
    .populate({ path: "userId" });
  if (!appointments.length) {
    return next(
      new Error("There Is no appointment for you doctor", { cause: 404 })
    );
  }
  return res.status(200).json({ message: "Done", appointments });
};

export const getProfile = async (req, res, next) => {
  const { _id } = req.user;
  const doctor = await DoctorModel.findById({ _id });
  if (!doctor) {
    return next(new Error("Invalid Doctor", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", doctor });
};

export const getDoctors = async (req, res, next) => {
  const doctors = await DoctorModel.find();
  if (doctors.length === 0) {
    return next(new Error("No doctors found", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", doctors });
};
