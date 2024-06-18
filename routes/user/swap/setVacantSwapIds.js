const Joi = require("joi");
const {
  find,
  findOne,
  updateDocument,
  insertNewDocument,
} = require("../../../helpers");


const setVacantSwapIds = async (req, res) => {
  try {

    const { id, swapId } = req.body;

    const vacantSwapIdDocUpd = await updateDocument(
      "vacantswapid",
      {
        _id: id,
      },
      {
        vacantswapid: swapId,
      }
    );

    if (!vacantSwapIdDocUpd) {
      return res.json({ status: "400", messsage: "No swap doc found" });
    }

    return res.json({ status: "200", vacantSwapIdDocUpd:vacantSwapIdDocUpd});
  } catch (error) {
    return res.json({ status: "500", message: error.message });
  }
};

module.exports = setVacantSwapIds;
