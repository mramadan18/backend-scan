import mongoose, { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/systemRoles.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    lastName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "userName is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
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
    images: [
      {
        type: String,
      },
    ],
    publicIDs: [
      {
        type: String,
      },
    ],
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Schema.Types.ObjectId,
      ref: "Record",
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
    timestamps: true,
  }
);

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
