const { find, findOne, findOneAndSelect } = require("../../../helpers");
const { launchPad } = require("../../../models");
//const { findOne } = require("../../../models/user");

const searchLaunchPad = async (req, res) => {

  try {

    // const { projectName, abstraction, nftType, nft_chain_id } = req.query;

    // let queryObj = {};

    // //   var regex = new RegExp(title);
    // if (projectName) {
    //   queryObj.projectName = { $regex: projectName, $options: "i" };
    // }

    // if (abstraction) {
    //   queryObj.abstraction = { $in: abstraction.split(",") };
    // }

    // if (nftType) {
    //   queryObj.nftType = { $in: nftType.split(",") };
    // }

    // if (nft_chain_id) {
    //   queryObj.nft_chain_id = { $in: nft_chain_id.split(",") };
    // }

    // // if (select) {
    // //   let selectFix = select.split(",").join(" ");
    // //   apiData = apiData.select(selectFix);
    // // }
    //  const totalData = await find("nft", queryObj);











    // const searchLaunchPad = await find("launchPad", {
    //     $or: [
    //         { projectName: { $regex: new RegExp(keyword + ".*", "i") } },

    //     ],
    // });

    // ///.*query.*/

    // //Limit search Reults to 10
    // // searchnft = searchLaunchPad.slice(0, 10);

    // if (!searchLaunchPad || searchLaunchPad.length < 0, keyword == "") return res.status(404).send({ status: 204, message: [] });



    // Live 

    const liveData = await launchPad.find({}, { expectedMintDate: 1, _id: 0 });
    const mintFunds = await launchPad.find({}, { mintFunds: 1, _id: 0 });
    if (!liveData) {
      return res.status(400).json({ status: 200, message: "No data found" });
    }

    const Funds = await launchPad.find({});

    // let launchData = liveData.filter(obj => obj.mintFunds === "24 hours" || "3 days" || "7 days")

    //let launchData = Funds.map(obj => obj.mintFunds.getDate() - obj.expectedMintDate.getDate());
    let launchData = Funds.map((obj) => {
      const mintfund = obj.mintFunds.getDate()
      const expectedMintDate = obj.expectedMintDate.getDate()
      const totallDays = mintfund - expectedMintDate
      console.log(totallDays, "totallDays...");
    });

    // console.log(obj.mintFunds.getTime(),"getimte..");

    // let days = Math.ceil(launchData / (1000 * 60 * 60 * 24));

    console.log(launchData, "launchData...");
    //console.log(mintFunds, "liveadTA...");
    //console.log(launchPad.mintFunds, "liveadmintfunds...");
    //console.log(liveData, "liveaexpected..");
    //console.log(newData, "newData...");
    console.log(typeof (liveData), "typeof");
    console.log(typeof (mintFunds), "typeof....");




    return res.status(200).json({ status: 200, message: "Launchpad get successfully" });
    // return res.status(200).json({ status: 200, message: "Launchpad get successfully", searchLaunchPad });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, message: error.message });
  }
};

module.exports = searchLaunchPad;

