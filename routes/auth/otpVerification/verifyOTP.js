//const  UserOTPVerification  = require("../../../models");
//const users = require('../../../models/user/index');

const {
  deleteManyDocument,
  updateDocument,
  find,
} = require("../../../helpers/index");
const saveActivity = require('../../../middleware/activity/save-activity');

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const UserOTPVerificationRecords = await find(UserOTPVerification, {
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        // no record found
        throw new Error(
          "Account record doesnot exist or has been verified already. Please sign up or login"
        );
      } else {
        // user otp record exists
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          // user otp record has expired
          //await UserOTPVerification.deleteMany({ userId });
          const deleteOtp = await deleteManyDocument("UserOTPVerification", {
            userId,
          });

          throw new Error("Code has expired. Please request again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            // supplied otp is wrong
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            // success
            await updateDocument("users", { _id: userId }, { verified: true });
            //  await UserOTPVerification.deleteMany({ userId });
            await deleteManyDocument("UserOTPVerification", { userId });
           saveActivity(req, res, `User ${userId} OTP verify successfully`);
            res.status(200).json({
              status: "VERIFIED",
              message: "User email verified successfully.",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = verifyOTP;
