const { findOne } = require("../../../helpers");

const getVacantSwapIds = async (req, res) => {
  try {
   console.log("hello world");

 const {id} = req.query
    const vacantSwapIdDoc = await findOne("vacantswapid", { _id:  id});
console.log(vacantSwapIdDoc);
    if (!vacantSwapIdDoc) {
      return res.json({ status: "400", messsage: "No swap doc found" });
    }

    return res.json({ status: "200", swapIds: vacantSwapIdDoc });
  } catch (error) {
    return res.json({ status: "500", message: error.message });
  }
};

module.exports = getVacantSwapIds;



