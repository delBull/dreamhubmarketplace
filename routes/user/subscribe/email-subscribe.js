const { send_email } = require("../../../lib/node-mailer");
const { findOne, insertNewDocument } = require("../../../helpers/index");
const Joi = require("joi");
//const sendOTPVerificationEmail = require('../../auth/otpVerification/index');
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
  email: Joi.string().email().required(),
});

const email_Subscribe = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email } = req.body;
    console.log(email);
    // Check if the email exists
    const findemail = await findOne("subscribe", { email });
    console.log(findemail);
    // If it does
    if (findemail) {
      return res
        .status(208)
        .json({ status: 208, messsage: "You have already subscribed" });
    }
    // And add it to the database
    const newSubscription = insertNewDocument("subscribe", {
      email,
    });


  

    send_email(
      "DreamHub",
      {
        username: email,
      },
      "DreamHub <info@dreamhub.art>",
      "Welcome to Dreamhub",
      `We are happy to have you join us ${email}`
    );
    saveActivity(req, res, `User ${email}  email has subscribe`);
    return res
      .status(200)
      .json({ status: 200, message: "User has subscribed." });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = email_Subscribe;
