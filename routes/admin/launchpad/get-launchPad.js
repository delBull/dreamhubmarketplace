const { findOne, find } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getLaunch = async (req, res) => {
  try {
    // const _id = req.params.id;

    // const launchpad = await findOne("launchPad", { _id });

     const launchpad = await find("launchPad");

    console.log(launchpad, "launchpad...");

    if (!launchpad) {
      return res.status(404).send({ status: 404, message: "No User launchpad Found" });
    }

    return res.status(200).send({ status: 200, launchpad });

  } catch (e) {

    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getLaunch;
