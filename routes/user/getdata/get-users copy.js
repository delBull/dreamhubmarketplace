const {
  find,
  getAggregate,
  getDataWithSort,
  getDataWithLimit,
} = require("../../../helpers");

const { ObjectID } = require("../../../types");

const searchnfts = async (req, res) => {
  try {
    const { title, abstraction, nftType, nft_chain_id, actualPrice, min, max } = req.query;
    
    let queryObj = {};
    
   // let sort = {};
    if (title) {
      queryObj.title = { $regex: title, $options: "i" };
    }

    if (abstraction) {
      queryObj.abstraction = { $in: abstraction.split(",") };
    }

    if (nftType) {
      queryObj.nftType = { $in: nftType.split(",") };
   //sort.nftType = nftType ;  
  }

    if (nft_chain_id) {
      queryObj.nft_chain_id = { $in: nft_chain_id.split(",") };
    }

    if (min != "0" && max != "0") {
      queryObj.actualPrice = { $gte: min, $lte: max };
    }

    if (actualPrice) {
      queryObj.actualPrice = actualPrice === "false" ? -1 : 1;
    }
   
  


//    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 0;

  //  let skip = (page - 1) * limit || 0 ;

    // const findNft = await find("nft");

    const apiData = await getDataWithLimit("nft", queryObj, {}, limit);
  //  if(apiData.length < 1){
  //   return res.json({ status: 500, message: "Oops no data found" });
  //  }
   
   
    // const apiData = await getDataWithSort("nft", queryObj, {}, {}, {});
    console.log(apiData, "apiData");

    let tempArray = [];

    for (let index = 0; index < apiData.length; index++) {
      const obj = apiData[index]._doc;
      const totalData = await find("user", { _id: obj.created_by });
      let data = {
        ...obj,
        createrObject: totalData,
      };
      if (index === apiData.length - 1) {
        tempArray.push(data);
        return res.json({
          status: 200,
          msg: tempArray,
          nbhit: apiData.length,
        });
      } else {
        tempArray.push(data);
      }
    }
  } catch (error) {
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = searchnfts;
