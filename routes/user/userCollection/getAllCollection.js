const {
  find,
  getDataWithLimit,
  insertNewDocument,
} = require("../../../helpers");
const Moralis = require("moralis").default;

const searchnfts = async (req, res) => {
  try {
    const { chain, collection_address, collection_name } = req.query;
 
    let queryObj = {};

    if (chain) {
      // queryObj.chain = new RegExp(chain);
      //queryObj.chain = { $regex: chain, $options: "i"  };
      queryObj.chain = chain;
    }

    if (collection_address) {
      //   queryObj.collection_address = {  $regex: collection_address,  $options: "i"  };
      queryObj.collection_address = collection_address;
    }

    if (collection_name) {
      queryObj.collection_name = { $regex: collection_name, $options: "i" };
    }

   // console.log(queryObj, "queryobe...");


   let page = Number(req.query.page) || 1;
   let limit = Number(req.query.limit) || 9;

   let skip = (page - 1) * limit;


// const limitData = limit || 0;
// console.log(limitData,"limit1");


const nftcollectionLength = await find("nftcollection");
const dhcollectionLength = await find("dhcontractcollection");

const datalength = dhcollectionLength.length + nftcollectionLength.length;
console.log(datalength,"datalength");

    const apiData = await getDataWithLimit("nftcollection", queryObj, skip, limit);
    const apidh = await getDataWithLimit("dhcontractcollection", queryObj, skip, limit);

 console.log(apiData.length,"apiData.length");
 console.log(apidh.length,"apidh.length");

    let data = [...apiData, ...apidh];

    console.log(data.length,"data");
    
    const moralisData = data.map((obj) => {
     // console.log(obj,"obj");
      return  find("nft", { tokenAddress: obj.collection_address, nft_chain_id:obj.chain }).then((nftObj) => {
    //   console.log(nftObj, "hello");
        return {
          ...obj._doc,
          nfts: nftObj.slice(0,10),
          //totalVolume : obj.length
        };
      });
    });
   
   
    Promise.all(moralisData).then((values) => {
     console.log( values.length ); // [3, 1337, "foo"]
      return res.json({ status: 200, msg: values , nbhit:datalength});
    });
  } catch (error) {
 //   console.log(error);
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = searchnfts;
