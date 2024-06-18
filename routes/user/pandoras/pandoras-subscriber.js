const {send_email}  = require("../../../lib/node-mailer");
const { findOne, insertNewDocument } = require("../../../helpers/index");
const Joi = require("joi");
const saveActivity = require('../../../middleware/activity/save-activity');

const schema = Joi.object({
  email: Joi.string().email().required(),
});

const pandoras_Subscribe = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { email } = req.body;
    // Check if the email exists
    const findemail = await findOne("pandoras", { email });
    // If it does
    if (findemail) {
      return res
        .status(208)
        .json({ status: 208, messsage: "You have already pandoras subscribed" });
    }
    // And add it to the database
    const newSubscription = insertNewDocument("pandoras", {
      email,
    });
    
  await saveActivity(req, res, "User pandoras subscribed successfullly");
    //  console.log('hello world');

    
    send_email(
      "pandora",
      {
        username: email,
      },
      "Pandoras <info@dreamhub.art>",
      "Welcome to Pandoras",
      `We are happy to have you join us ${email}`
    );
    saveActivity(req, res, `User ${email} pandoras subscribed successfullly`);
    return res
      .status(200)
      .json({ status: 200, message: "User has pandoras subscribed." });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = pandoras_Subscribe;


//api/v1/user/subscribe/email