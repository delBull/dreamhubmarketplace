const { findOne, find, getDataWithSort } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const launchApprovedSingleData = async (req, res) => {
  try {
    const { userAddress } = req.query;
   

    let queryObj = {}

    if(userAddress) {
      queryObj.userAddress = userAddress;
    }
    const launchpad = await find("launchPad", { userAddress: userAddress });

    if (launchpad.length < 1) {
      return res.json({ status: 401, message: "Oops No Data Found!" });
    }
   

  //   let page = Number(req.query.page) || 1;
  //   let limit = Number(req.query.limit) || 9;

  //   let skip = (page - 1) * limit;


  //  const launchPadData = await getDataWithSort("launchPad", queryObj, {}, skip, limit);
   
  //  if (launchPadData.length < 1) {
  //      return res.json({ status: 401, message: "Oops No Data Found!" });
  //    }
     
  //    console.log(launchPadData, "launchPadData");


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

module.exports = launchApprovedSingleData;
