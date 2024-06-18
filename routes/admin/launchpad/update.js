const Joi = require("joi");
// const { findOne } = require("../../../helpers");
const { findOne, updateDocument, find } = require("../../../helpers");
const schema = Joi.object({
  status: Joi.string(),
  userAddress: Joi.string(),
  id: Joi.string(),
});

const approvedLaunchpad = async (req, res) => {
  try {
    await schema.validateAsync(req.body);

    const { status, userAddress,id,deployedContractAddress } = req.body;
    console.log(req.body);
    //const _id = req.params.id;

    let launchpad = await findOne("launchPad", { userAddress: userAddress,_id:id });
    if (!launchpad) {
      return res.status(400).send({ status: 400, message: "No User Found" });
    }
console.log(launchpad,"launchpad");
    // if (launchpad) {
    //   if (launchpad.userAddress !== userAddress) {
    //     return res.status(400).send({
    //       status: 400,
    //       message: "User not exist with this email",
    //     });
    //   }
    // }

    const user = await updateDocument("launchPad", { _id:id }, {status:status,deployedContractAddress:deployedContractAddress});


console.log(user,'user');

    const Users = await find("launchPad");

    return res
      .status(200)
      .send({ status: 200, message: "User Approved Successfully", Users });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = approvedLaunchpad;
