const { findOne, find, getDataWithLimit } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const getAllLaunchData = async (req, res) => {
  try {
    let limitData = req.query.limit || 9;
    let pageData = req.query.page || 1;
    let skipData = (pageData - 1) * limitData;
    console.log(req.query);

    const launchpad = await getDataWithLimit("launchPad", {
      status: "Deployed"},
      skipData,
      limitData,
    );

    if (launchpad.length < 1) {
      return res.json({ status: 401, message: "Oops No Data Found!" });
    }

    return res.status(200).send({
      status: 200,
      msg: "User get the launchpad data successfully",
      launchpad,
      nbhit: launchpad.length,
    });
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getAllLaunchData;
