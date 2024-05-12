import userModel from "../../../DB/model/User.model.js";
import moment from "moment/moment.js";
import pkg from "bcryptjs";
import {
  tokenDecode,
  tokenGeneration,
} from "../../utils/GenerateAndVerifyToken.js";
import sendEmail from "../../utils/sendEmail.js";
import { customAlphabet } from "nanoid";
import DoctorModel from "../../../DB/model/Doctor.model.js";
import { systemRoles } from "../../utils/systemRoles.js";
import {
  BEARER_KEY,
  SALT_ROUNDS,
  logo,
  TOKEN_SIGNATURE,
  facebookLink,
  twitterLink,
  instegram,
} from "../../../config/config.js";
const nanoId = customAlphabet("123456789", 6);
//======================== signUp =======================
export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    DOB,
    type,
    availableDates,
    address,
  } = req.body;
  if (type === "Doctor") {
    const emailEixsts = await DoctorModel.findOne({ email }).select(
      "_id email"
    );
    if (emailEixsts) {
      return next(new Error("Email is Already Exists", { cause: 400 }));
    }
    let array = [];
    const fromDateMoment = moment(new Date(DOB)).format("DD-MM-YYYY HH:mm");
    for (const i of availableDates) {
      const fromMoment = moment(new Date(i)).format("YYYY-MM-DD");
      array.push(fromMoment);
    }
    const hashedpassword = pkg.hashSync(password, +SALT_ROUNDS);
    const newUser = new DoctorModel({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      phone,
      DOB: fromDateMoment,
      role: systemRoles.DOCTOR,
      availableDates: array,
      address,
    });

    // confimation
    const token = tokenGeneration({
      payload: {
        _id: newUser._id,
        email: newUser.email,
        type: type,
        role: newUser.role,
      },
    });

    if (!token) {
      return next(new Error("Token Generation Fail", { cause: 400 }));
    }
    const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    // const message = `<a href= ${confirmationLink}>Click to confirm</a>`
    const message = `<!DOCTYPE html>
        <html>
        
        <head>
          <title>Confirm Email</title>
          <style>
            body {
              background-color: #f0f0f0;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            
            .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            
            p {
              font-size: 16px;
              margin-bottom: 30px;
            }
            
            .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #008CBA;
              color: #ffffff;
              font-size: 16px;
              font-weight: bold;
              border-radius: 5px;
              text-decoration: none;
              transition: background-color 0.3s ease-in-out;
            }
            
            .btn:hover {
              background-color: #006d8b;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <h1>Confirm Email</h1>
            <p>Thank you for registering! To complete your registration, please click the button below to confirm your email address:</p>
            <a class="btn" href=${confirmationLink}>Confirm Email</a>
          </div>
        </body>
        
        </html>
        `;
    const sentEmail = await sendEmail({
      to: email,
      message,
      subject: "Confirmation Email",
    });
    if (!sentEmail) {
      return next(new Error("Send Email Service Fails", { cause: 400 }));
    }
    await newUser.save();
    return res
      .status(201)
      .json({ message: "registration success , please confirm your email" });
  }
  const emailEixsts = await userModel.findOne({ email }).select("_id email");
  if (emailEixsts) {
    return next(new Error("Email is Already Exists", { cause: 400 }));
  }
  const hashedpassword = pkg.hashSync(password, +SALT_ROUNDS);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedpassword,
    phone,
    DOB,
    role: systemRoles.USER,
    address,
  });

  // confimation
  const token = tokenGeneration({
    payload: { _id: newUser._id, email: newUser.email, role: newUser.role },
  });

  if (!token) {
    return next(new Error("Token Generation Fail", { cause: 400 }));
  }
  const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;

  const message = `<!DOCTYPE html>
        <html>
        
        <head>
          <title>Confirm Email</title>
          <style>
            body {
              background-color: #f0f0f0;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            
            .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
            }
            
            p {
              font-size: 16px;
              margin-bottom: 30px;
            }
            
            .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #008CBA;
              color: #ffffff;
              font-size: 16px;
              font-weight: bold;
              border-radius: 5px;
              text-decoration: none;
              transition: background-color 0.3s ease-in-out;
            }
            
            .btn:hover {
              background-color: #006d8b;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <h1>Confirm Email</h1>
            <p>Thank you for registering! To complete your registration, please click the button below to confirm your email address:</p>
            <a class="btn" href=${confirmationLink}>Confirm Email</a>
          </div>
        </body>
        
        </html>
        `;
  const sentEmail = await sendEmail({
    to: email,
    message,
    subject: "Confirmation Email",
  });
  if (!sentEmail) {
    return next(new Error("Send Email Service Fails", { cause: 400 }));
  }
  await newUser.save();
  return res
    .status(201)
    .json({ message: "registration success , please confirm your email" });
};

//========================= confirmation Email ==================
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  const decode = tokenDecode({ payload: token });
  if (!decode?._id) {
    return next(new Error("Decoding Fails", { cause: 400 }));
  }
  if (decode?.type) {
    const doctorConfirmed = await DoctorModel.findOneAndUpdate(
      { _id: decode._id, isConfirmed: false },
      {
        isConfirmed: true,
      }
    );
    if (!doctorConfirmed) {
      return next(
        new Error(
          "please check if you already confirm you email , if not please try to signup again",
          { cause: 400 }
        )
      );
    }
    return res.status(200).json({ message: "Your email confirmed", decode });
  }
  const userConfirmed = await userModel.findOneAndUpdate(
    { _id: decode._id, isConfirmed: false },
    {
      isConfirmed: true,
    }
  );
  if (!userConfirmed) {
    return next(
      new Error(
        "please check if you already confirm you email , if not please try to signup again",
        { cause: 400 }
      )
    );
  }
  return res.status(200).json({ message: "Your email confirmed", decode });
};

//=========================== Login =============================
export const login = async (req, res, next) => {
  const { email, password, type } = req.body;
  const ipAddress = req.ip;
  console.log({ ipAddress });
  if (type === "Doctor") {
    const Doctor = await DoctorModel.findOne({ email, isConfirmed: true });
    if (!Doctor) {
      return next(
        new Error(
          "please if enter a valid email or make sure that you confirm your email , Doctor",
          { cause: 400 }
        )
      );
    }
    const match = pkg.compareSync(password, Doctor.password);
    if (!match) {
      return next(
        new Error("in-valid login information Doctor", { cause: 400 })
      );
    }
    const token = tokenGeneration({
      payload: {
        _id: Doctor._id,
        email: Doctor.email,
        isLoggedIn: true,
        type: type,
      },
    });
    await DoctorModel.findOneAndUpdate({ email }, { isLoggedIn: true });
    return res.status(200).json({ message: "Login Done", token });
  }
  const user = await userModel.findOne({ email, isConfirmed: true });
  if (!user) {
    return next(
      new Error(
        "please if enter a valid email or make sure that you confirm your email",
        { cause: 400 }
      )
    );
  }
  const match = pkg.compareSync(password, user.password);
  if (!match) {
    return next(new Error("in-valid login information", { cause: 400 }));
  }
  const token = tokenGeneration({
    payload: {
      _id: user._id,
      email: user.email,
      isLoggedIn: true,
    },
  });
  await userModel.findOneAndUpdate({ email }, { isLoggedIn: true });
  return res.status(200).json({ message: "Login Done", token });
};

//=========================== send code =======================
export const sendCode = async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({
    email,
    isConfirmed: true,
    role: systemRoles.USER,
  });

  if (!user) {
    // return next(new Error('please sign up fisrt', { cause: 400 }))
    const doctor = await DoctorModel.findOne({
      email,
      isConfirmed: true,
      role: systemRoles.DOCTOR,
    });
    if (!doctor) {
      return next(
        new Error("Email not found. Please sign up first", { cause: 400 })
      );
    }
    // nanoid = hfj765765fhj
    const otp = nanoId();
    const otpExpire = Date.now() + 225000;

    // const otpExpire = Date.now() + 3600000; expire in one hour
    const fromDateMoment = moment(new Date(otpExpire)).format(
      "YYYY-MM-DD HH:mm:ms"
    );

    // const message = `<p> OTP is ${forgetCode} </p>`

    const message = `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="${logo}">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Forget password</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;margin:10px 0px 30px 0px ">  your verfication code is
        </p>
        </td>
        </tr>
        <tr>
        </tr>
        <tr>
        </tr>
        <tr>
        <td>
        <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B;">${otp}</p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">
    
        <a href="${facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>
    
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
       </html>`;
    const sentEmail = await sendEmail({
      to: doctor.email,
      message,
      subject: "Forget Password",
    });
    if (!sentEmail) {
      return next(new Error("Send Email Service Fails", { cause: 400 }));
    }
    const saved = await DoctorModel.findOneAndUpdate(
      { email: doctor.email },
      { otp, otpExpire },
      { new: true }
    );
    return res.status(200).json({ message: "OTP sent successfully", saved });
  }

  // nanoid = hfj765765fhj
  const otp = nanoId();
  const otpExpire = Date.now() + 225000;

  // const otpExpire = Date.now() + 3600000; expire in one hour
  const fromDateMoment = moment(new Date(otpExpire)).format(
    "YYYY-MM-DD HH:mm:ms"
  );

  // const message = `<p> OTP is ${forgetCode} </p>`

  const message = `<!DOCTYPE html>
             <html>
             <head>
                 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
             <style type="text/css">
             body{background-color: #88BDBF;margin: 0px;}
             </style>
             <body style="margin:0px;"> 
             <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
             <tr>
             <td>
             <table border="0" width="100%">
             <tr>
             <td>
             <h1>
                 <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
             </h1>
             </td>
             <td>
             <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             <tr>
             <td>
             <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
             <tr>
             <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
             <img width="50px" height="50px" src="${logo}">
             </td>
             </tr>
             <tr>
             <td>
             <h1 style="padding-top:25px; color:#630E2B">Forget password</h1>
             </td>
             </tr>
             <tr>
             <td>
             <p style="padding:0px 100px;margin:10px 0px 30px 0px ">  your verfication code is
             </p>
             </td>
             </tr>
             <tr>
             </tr>
             <tr>
             </tr>
             <tr>
             <td>
             <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B;">${otp}</p>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             <tr>
             <td>
             <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
             <tr>
             <td>
             <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
             </td>
             </tr>
             <tr>
             <td>
             <div style="margin-top:20px;">
         
             <a href="${facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
             <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
             
             <a href="${instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
             <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
             </a>
             
             <a href="${twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
             <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
             </a>
         
             </div>
             </td>
             </tr>
             </table>
             </td>
             </tr>
             </table>
             </body>
            </html>`;
  const sentEmail = await sendEmail({
    to: user.email,
    message,
    subject: "Forget Password",
  });
  if (!sentEmail) {
    return next(new Error("Send Email Service Fails", { cause: 400 }));
  }
  const saved = await userModel.findOneAndUpdate(
    { email: user.email },
    { otp, otpExpire },
    { new: true }
  );
  return res.status(200).json({ message: "OTP sent successfully", saved });
};

//========================== reset password ===============================
export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("please sign up fisrt", { cause: 400 }));
  }
  if (user.otp != otp) {
    return next(new Error("in-valid OTP", { cause: 400 }));
  }
  if (user.otpExpire < Date.now()) {
    return res.status(400).json({ msg: "OTP has expired" });
  }
  const hashedPass = pkg.hashSync(newPassword, +SALT_ROUNDS);
  // const updatedUser = await userModel.findOneAndUpdate({ email }, {
  //     password: hashedPass,
  //     forgetCode: null
  // }, {
  //     new: true
  // })
  // if (!updatedUser) {
  //     return next(new Error('please sign up fisrt', { cause: 400 }))
  // }
  user.otp = null;
  user.otpExpire = null;
  user.password = hashedPass;
  user.changePassword = Date.now();
  const userUpdated = await user.save();
  return res.status(200).json({ message: "please login", userUpdated });
};

//========================== reset password ===============================
export const resetPass = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await userModel.findOne({ email, role: systemRoles.USER });
  const doctor = await DoctorModel.findOne({ email, role: systemRoles.DOCTOR });

  if (!user && !doctor) {
    return next(new Error("please sign up fisrt", { cause: 400 }));
  }
  const model = user || doctor;

  if (!model.otp || model.otp != otp) {
    return next(new Error("in-valid OTP", { cause: 400 }));
  }
  if (model.otpExpire < Date.now()) {
    return next(new Error("OTP has expired", { cause: 400 }));
  }
  const hashedPass = pkg.hashSync(newPassword, +SALT_ROUNDS);
  model.otp = null;
  model.otpExpire = null;
  model.password = hashedPass;

  model.changePassword = Date.now();
  const userUpdated = await model.save();
  return res.status(200).json({ message: "please login", userUpdated });
};
