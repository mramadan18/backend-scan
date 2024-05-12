import mongoose, { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const DoctorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "DoctorName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    lastName: {
      type: String,
      required: [true, "DoctorName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "DoctorName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    availableDates: [
      {
        type: String,
        required: true,
      },
    ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: systemRoles.USER,
      enum: [systemRoles.USER, systemRoles.DOCTOR],
    },
    address: {
      type: String,
      required: true,
      enum: ["Fayoum", "Cairo", "Alex"],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    Image: {
      path: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    otp: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    changePassword: Number,
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);
DoctorSchema.virtual("Appointments", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "doctorId",
});

const DoctorModel = mongoose.models.Doctor || model("Doctor", DoctorSchema);
export default DoctorModel;
