const mongoose = require("mongoose");
const UserOTPVerificationSchema = require("./userOTPVerification");

const UserOTPVerification = mongoose.model("UserOTPVerification", UserOTPVerificationSchema);

module.exports = UserOTPVerification ;