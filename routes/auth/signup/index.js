const Joi = require("joi");
const {
  findOne,
  insertNewDocument,
  findOneAndSelect,
  updateDocument,
} = require("../../../helpers");
const { SECRET } = require("../../../config");
const jwt = require("jsonwebtoken");
const { tokenVerification } = require("../../../middleware");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
  preferred_method: Joi.string().required().valid("Email", "MetaMask"),
  username: Joi.string().when("preferred_method", {
    is: "MetaMask",
    then: Joi.required(),
  }),
  type: Joi.string().when("preferred_method", {
    is: "MetaMask",
    then: Joi.required(),
  }),
  metaAddress: Joi.string().when("preferred_method", {
    is: "Email",
    then: Joi.required(),
  }),
  userId: Joi.string().when("preferred_method", {
    is: "Email",
    then: Joi.required(),
  }),
});

const signup = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    const { username, type, preferred_method, metaAddress, userId } = req.body;
    if (preferred_method === "MetaMask") {
      const address = await req.web3.utils.isAddress(username);

      if (!address) {
        return res.status(400).send({
          status: 400,
          message: "Your provided username is not valid",
        });
      }
console.log(address, "addresss");
      let user = await findOneAndSelect(
        "user",
        { username: new RegExp("^" + username + "$", "i") },
        "-followers -following"
      );

      console.log(user, "user");

      if (user) {
        const resetAttempt = await updateDocument(
          "attempt",
          {
            user_id: user._id,
          },
          {
            no_of_attempt: 0,
            block: false,
            // block_duration: null,
          }
        );
        const token = jwt.sign({ id: user._id }, SECRET, {
          expiresIn: "24h",
        });
        req.userId = user._id;
console.log(token,"token");
        console.log(req.userId = user._id, "userId ");


        saveActivity(req, res, "User Signup Successfully");
        return res.status(200).send({ status: 200, user, token });
      }

      const user_type = await findOne("userType", { type });
      if (!user_type) {
        return res
          .status(404)
          .send({ status: 404, message: "No User Type Found" });
      }

      user = await insertNewDocument("user", {
        username,
        full_Name: "Unnamed",
        bio: "I just love NFTs and that's the reason I joined this cool Marketplace. Looking forward to engaging with all of you guys. Cheers!",
        type: user_type._id,
      });
      const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: "24h",
      });

      const resetAttempt = await updateDocument(
        "attempt",
        {
          user_id: user._id,
        },
        {
          no_of_attempt: 0,
          block: false,
          // block_duration: null,
        }
      );
      req.userId = user._id;
      //saveActivity(req, res, "signup successfully");
      return res.status(200).send({ status: 200, user, token });
    }

    if (preferred_method === "Email") {
      // tokenVerification(req, res, next);
      const address = await req.web3.utils.isAddress(metaAddress);
      if (!address) {
        return res.status(400).send({
          status: 400,
          message: "Your provided username is not valid",
        });
      }

      let user = await findOneAndSelect(
        "user",
        { username: new RegExp("^" + metaAddress + "$", "i") },
        "-followers -following"
      );

      if (user) {
        // return res.status(400).send({
        //   status: 400,
        //   message: "User already exists with this account address",
        // });
        delete user?.following;
        delete user?.followers;
        const token = jwt.sign({ id: user._id }, SECRET, {
          expiresIn: "24h",
        });
        const resetAttempt = await updateDocument(
          "attempt",
          {
            user_id: user._id,
          },
          {
            no_of_attempt: 0,
            block: false,
            // block_duration: null,
          }
        );
        req.userId = user._id;

        return res.status(200).send({ status: 200, user, token });
      }

      const check_user = await findOne("user", { _id: userId });
      if (!check_user) {
        return res.status(404).send({
          status: 404,
          message: "No user found",
        });
      }

      user = await updateDocument(
        "user",
        {
          _id: userId,
        },
        {
          username: metaAddress,
        }
      );
      // user.following = undefined;
      // user.followers = undefined;
      delete user?.following;
      delete user?.followers;
      const token = jwt.sign({ id: user._id }, SECRET, {
        expiresIn: "24h",
      });
      const resetAttempt = await updateDocument(
        "attempt",
        {
          user_id: user._id,
        },
        {
          no_of_attempt: 0,
          block: false,
          // block_duration: null,
        }
      );

      await saveActivity(req, res, `${username} signup successfully`);
      return res.status(200).send({ status: 200, user, token });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = signup;
