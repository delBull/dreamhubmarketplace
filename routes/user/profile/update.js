const Joi = require("joi");
const { findOne, updateDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");
const cloudinary = require("cloudinary").v2;
// const fs = require("fs");
const schema = Joi.object({
  // full_Name: Joi.string().required(),
  // email: Joi.string().email().required(),
  // bio: Joi.string().required(),
  // twitter: Joi.string().required(),
  // facebook: Joi.string().required(),
  // instagram: Joi.string().required(),
  // profile_img: Joi.string().required(),
  // cover_img: Joi.string().required(),
  username: Joi.string(),
  full_Name: Joi.string(),
  email: Joi.string(),
  bio: Joi.string(),
  instagram: Joi.string(),
  facebook: Joi.string(),
  twitter: Joi.string(),
  discord: Joi.string(),
  tiktok: Joi.string(),
  url: Joi.string(),
});

const updateProfile = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    console.log(req.body);
    console.log(req.files);
    const { email } = req.body;
    const _id = req.params.id;
    let user = await findOne("user", { _id });
    if (!user) {
      return res.status(400).send({ status: 400, message: "No User Found" });
    }
    if (email) {
      let check_email = await findOne("user", { email });
      if (check_email) {
        if (user.email !== email) {
          return res.status(400).send({
            status: 400,
            message: "User already exist with this email",
          });
        }
      }
    }
    if (req?.files?.profile_img?.path) {
      const profileImage = await cloudinary.uploader.upload(
        req?.files?.profile_img?.path, {quality: 20}
      );
      req.body.profile_img = profileImage.url;
      // fs.unlinkSync(req?.files?.profile_img[0].path);
    }
    if (req?.files?.cover_img?.path) {
      const coverImage = await cloudinary.uploader.upload(
        req?.files?.cover_img?.path,{quality: 20}
      );
      req.body.cover_img = coverImage.url;
      // fs.unlinkSync(req?.files?.cover_img[0].path);
    }
    user = await updateDocument("user", { _id }, req.body);
    saveActivity(req, res, `User ${email} profile updated successfully...`);
    return res
      .status(200)
      .send({ status: 200, message: "User Updated Successfully", user });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = updateProfile;
