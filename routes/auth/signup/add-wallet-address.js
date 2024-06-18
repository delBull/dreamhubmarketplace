const Joi = require("joi");
const { findOneAndSelect, updateDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");
const { SECRET } = require("../../../config");
const jwt = require("jsonwebtoken");

const schema = Joi.object({
  username: Joi.string().required(),
});

const addWalletAddress = async (req, res) => {
  try {
    await schema.validateAsync(req.params);
    const { username } = req.params;
    const address = await req.web3.utils.isAddress(username);
    if (!address) {
      return res.status(400).send({
        status: 400,
        message: "Your provided username is not valid",
      });
    }
    let user = await findOneAndSelect(
      "user",
      { username: new RegExp("^" + username + "$", "i") },
      "-followers -following"
    );
    if (user) {
      return res.status(400).send({
        status: 400,
        message: "User already exists with this account address",
      });
    }
    user = await updateDocument(
      "user",
      {
        _id: req.userId,
      },
      {
        username,
      }
    );
    // user.following = undefined;
    // user.followers = undefined;
    delete user?.following;
    delete user?.followers;
    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "24h",
    });
    saveActivity(req, res, `${username} signUp to added wallet address`);
    return res.status(200).send({ status: 200, user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = addWalletAddress;
