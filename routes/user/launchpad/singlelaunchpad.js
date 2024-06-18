const { findOne } = require("../../../helpers");

const getSingleLauchpad = async (req, res) => {
  try {
    const { id } = req.params;
    const launchpad = await findOne("launchPad", { _id: id });

    if (!launchpad) {
      return res.json({ status: 401, message: "Oops No Data Found!" });
    }
  
    return res
      .status(200)
      .send({
        status: 200,
        msg: "User get the launchpad data successfully",
        launchpad,
      });
  } catch (e) {
    return res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = getSingleLauchpad;
