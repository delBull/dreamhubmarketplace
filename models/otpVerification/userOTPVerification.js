const mongoose = require("mongoose");
const SchemaType = require("../../types");

const UserOTPVerificationSchema = new mongoose.Schema(
  {
    userID: SchemaType.TypeString,
    otp: SchemaType.TypeString,
    createdAt: Date,
    expiresAt: Date,
},
  { timestamps: true }
);

module.exports = UserOTPVerificationSchema;
