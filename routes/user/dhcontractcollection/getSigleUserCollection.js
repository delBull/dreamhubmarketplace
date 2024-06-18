const { findOne } = require("../../../helpers");

const getSingleUserCollection = async (req, res) => {
  try {
    const { id } = req.query;
    const usertCollection = await findOne("dhcontractcollection", {
      _id: id,
    });

    console.log(usertCollection, "usertCollection");
    if (!usertCollection) {
      return res.status(404).send({
        status: 404,
        message: "Collection not found",
      });
    }

    return res.status(200).send({ status: 200, usertCollection });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getSingleUserCollection;
