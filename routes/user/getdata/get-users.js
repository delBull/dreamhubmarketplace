const {
  find,
  getDataWithSort,
  } = require("../../../helpers");

const { ObjectID } = require("../../../types");

const searchnfts = async (req, res) => {
  try {
    const { title, abstraction, nftType, nft_chain_id, actualPrice, min, max, contract } = req.query;

    let queryObj = {};

    if (title) {
      queryObj.title = { $regex: title, $options: "i" };
    }

    if (abstraction) {
      queryObj.abstraction = { $in: abstraction.split(",") };
    }

    if (nftType) {
      queryObj.nftType = { $in: nftType.split(",") };
    }

    if (contract) {
      queryObj.contract = { $in: contract.split(",") };
    }
    if (nft_chain_id) {
      queryObj.nft_chain_id = { $in: nft_chain_id.split(",") };
    }

    if(min || "" && max || "" ){
      queryObj.actualPrice = { $gte: min, $lte: max };
    }

    let sort = {};
    if (actualPrice) {
      sort.actualPrice = actualPrice === "false" ? -1 : 1;
    }
   

     let page = Number(req.query.page) || 1;
     let limit = Number(req.query.limit) || 9;

     let skip = (page - 1) * limit;

   

     const dataLength = await getDataWithSort("nft", queryObj, {}, {}, {});


    const apiData = await getDataWithSort("nft", queryObj, sort, skip, limit);
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
          length:tempArray.length,
          nbhit: dataLength.length,
        });
      }

     else {
        tempArray.push(data);
      }
   }


   return res.json({status: 200, msg:apiData, nbhit: apiData.length})

  } catch (error) {
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = searchnfts;
