const sendOTPVerificationEmail = require("./sendOTPVerificationEmail.js");
//const  UserOTPVerification  = require("../../../models/otpVerification/index.js");
const { deleteManyDocument } = require("../../../helpers/index");
const saveActivity = require("../../../middleware/activity/save-activity");

const resendOTPVerificationCode = async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      throw new Error("Empty user details are not allowed");
    } else {
      // delete existing records and resend
      //await UserOTPVerification.deleteMany({ userId });
      const deleteOtp = await deleteManyDocument("UserOTPVerification", {
        userId,
      });
      sendOTPVerificationEmail({ _id: userId, email }, res);
     saveActivity(req, res, `User ${email} resendOTPcode successfully`);

      return res
        .status(200)
        .json({ status: 200, message: sendOTPVerificationEmail });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = resendOTPVerificationCode;
