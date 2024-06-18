const Joi = require("joi");
// const { findOne } = require("../../../helpers");
const { findOne, updateDocument, find } = require("../../../helpers");
const schema = Joi.object({
  status: Joi.string(),
  id: Joi.string(),
  deployedContractAddress: Joi.string(),
});

const approvedLaunchpad = async (req, res) => {
  try {
    await schema.validateAsync(req.body);

    const { status, id, deployedContractAddress } = req.body;
    console.log(req.body);

    let launchpad = await findOne("launchPad", { _id: id });
    if (!launchpad) {
      return res.status(400).send({ status: 400, message: "No User Found" });
    }

    const user = await updateDocument(
      "launchPad",
      { _id: id },
      { status, deployedContractAddress }
    );

    console.log(user, "user");

    return res
      .status(200)
      .send({ status: 200, message: "User Launchpad Deployed Successfully", user });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = approvedLaunchpad;
