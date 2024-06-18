const { UserOTPVerification } = require("../../../models");
const bcrypt = require("bcryptjs");
//const nodemailer = require('nodemailer');
const { send_email } = require("../../../lib/node-mailer/index");
const { insertNewDocument } = require("../../../helpers/index");
const saveActivity = require("../../../middleware/activity/save-activity");
//const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = require("../../../config/index");

// send otp verification email
const sendOTPVerificationEmail = async (req, res) => {
  try {
    const { _id, email } = req.body;
    console.log(email, "email");

    // const transporter = nodemailer.createTransport({
    //   host: MAIL_HOST,
    //   port: MAIL_PORT,
    //   secure: true,
    //   auth: {
    //     user: MAIL_USER,
    //     pass: MAIL_PASS,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options

    // const mailOptions = {
    //   from: "softsyncdev@art",
    //   to: email,
    //   subject: "Verify Your Email",
    //   html: `<p>Enter <b>${otp}<b/> in the app to verify your email address and complete<p/><p>This code <b>expires in 1 hour</b>.<p/>`,
    // };

    // hash the otp
    const saltRounds = 10;

    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOtpVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    // save otp record
    //await newOtpVerification.save();
    const insertNewDocument = await insertNewDocument("newOtpVerification", {
      ...req.body,
    });
    //transporter.sendMail(mailOptions);

    //transporter.sendMail(mailOptions);

    //     if(send_email) {

    // send_email(
    //   "pandora",
    //   {
    //     username:  `<p>Enter <b>${otp}<b/> in the app to verify your email address and complete<p/><p>This code <b>expires in 1 hour</b>.<p/>`,
    //   },
    //   "info@dreamhub.art",
    //   "Verify Your Email",
    //   email,

    // );

    // }

    send_email(
      "otptemplate",
      {
        otp: otp,
      },
      "info@dreamhub.art",
      "Verify Your Email",
      email
    );

    saveActivity(req, res, `User ${email} send OTP successfully`);
    res.status(200).json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Enter current otp",
    });
  }
};

module.exports = sendOTPVerificationEmail;
