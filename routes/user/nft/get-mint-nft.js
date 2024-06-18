const { find, getAggregate, getDataWithLimit } = require("../../../helpers");

const getMintNft = async (req, res) => {
  try {
    const mintNfts = await getAggregate("nft", [
      {
        $match: {
          nftType: "mint",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerObject",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "creatorObject",
        },
      },
    ]);

    const {
      created_by,
      abstraction,
      nftType,
      actualPrice,
      contract,
      min,
      max,
    } = req.query;

    let queryObj = {};
    console.log(queryObj, "queryObj");
    //   var regex = new RegExp(title);
    if (created_by) {
      //  queryObj.created_by = { $regex: created_by, $options: "i" };
      queryObj.created_by = created_by;
    }

    if (abstraction) {
      queryObj.abstraction = { $in: abstraction.split(",") };
    }

    if (contract) {
      queryObj.contract = { $in: contract.split(",") };
    }

    if (nftType) {
      queryObj.nftType = { $in: nftType.split(",") };
    }

    //if (min || max) {
      //  let queryStr = JSON.stringify(queryObj);
      //   console.log(queryStr,"queryStr");
     // queryObj.actualPrice = { actualPrice: { $gte: min, $lte: max } }
     // queryObj.actualPrice =  JSON.stringify(queryObj );
      //      price = queryObj.actualPrice

      //console.log( queryObj.actualPrice," queryObj.actualPrice");
      //  queryObj.actualPrice = actualPrice
      //  queryStr = price.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$$(match)`);
      // console.log(JSON.parse(queryStr));
    

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$$(match)`);
    // console.log(JSON.parse(queryStr));

    // if (select) {
    //   let selectFix = select.split(",").join(" ");
    //   apiData = apiData.select(selectFix);
    // }

    //console.log(queryObj, "owais");
   // }


    const totalData = await find("nft", {
      nftType: {$in: ["sell", "auction", "bid","buy" ,"swap" ]}} ,
    );
if(!totalData) {
  return res.status(200).send({ status: 400,msg: "No nft found" })
}

   console.log(totalData, "totaldata.....");

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    let skip = (page - 1) * limit;

    console.log(skip, "skip.....");
    console.log(page, "page.....");
    console.log(limit, "limit.....");

    //   const Data = apiData.skip(skip).limit(limit);

    //  console.log(queryObj);

    //    const apiData = await find("nft", queryObj);

    //console.log(apiData,"helooooooo");

    const apiData = await getDataWithLimit("nft", queryObj, skip, limit);
    console.log(apiData, "apiData...........");
    //console.log(Data, "data......");
  
    return res.status(200).send({ status: 200, mintNfts, apiData,totalData });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getMintNft;
