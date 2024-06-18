const Joi = require("joi");
const {
  findOne,
  insertNewDocument,
  findOneAndSelect,
} = require("../../../helpers");
const { SECRET } = require("../../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
  first_Name: Joi.string().required(),
  last_Name: Joi.string().required(),
  full_Name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")).required(),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
  type: Joi.string().required(),
});

const signupWithEmail = async (req, res) => {
  try {
    await schema.validateAsync(req.body);
    const { password, type, email } = req.body;
    const emailExist = await findOneAndSelect(
      "user",
      { email },
      "-followers -following"
    );
    if (emailExist) {
      return res
        .status(400)
        .send({ status: 400, message: "User already exists with this email" });
      //   const token = jwt.sign({ user }, SECRET
      // , {
      //   expiresIn: "24h",
      // }
      // );
      //   return res.status(200).send({ status: 200, user, token });
    }
    const user_type = await findOne("userType", { type });
    if (!user_type) {
      return res
        .status(404)
        .send({ status: 404, message: "No User Type Found" });
    }
    req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const user = await insertNewDocument("user", {
      ...req.body,
      bio: "I just love NFTs and that's the reason I joined this cool Marketplace. Looking forward to engaging with all of you guys. Cheers!",
      type: user_type._id,
    });
    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "24h",
    });
    req.userId = user._id;
   saveActivity(req, res, `${email} signUp to added email address`);

    return res.status(200).send({ status: 200, user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: "Invalid username or password" });
  }
};

module.exports = signupWithEmail;
