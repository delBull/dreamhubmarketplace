const { find, getDataWithLimit } = require("../../../helpers");

const getSingleUserCollection = async (req, res) => {
  try {
    const { wallet_address,limit, page } = req.body;

    console.log(wallet_address, "wallet_address");

    const nftCollectionLength = await find("dhcontractcollection", {
      wallet_address: wallet_address, 
    });

    // console.log(nftCollection,"nftCollection");
    // if (nftCollection < 1) {
    //   return res.json({ status: 200, msg: "No Collection Found" });
    // }

    const collectionLength = await find("nftcollection", {
      wallet_address: wallet_address, 
    });

let totalLength = nftCollectionLength.length + nftCollectionLength.length

    let limitData = limit || 9;
    let pageData = page || 1;
    let skipData = (pageData - 1) * limitData;

    const nftCollection = await getDataWithLimit("dhcontractcollection", { wallet_address: wallet_address, },skipData,limitData);
    const collection = await getDataWithLimit("nftcollection", { wallet_address: wallet_address, },skipData,limitData);
   if(!nftCollection && !collection) {
    return res.json({status: 401 , message: "Collection Not Found"})
   }

    let data = [...nftCollection, ...collection];

    console.log(data,"data");

    const moralisData = data.map((obj) => {
      // console.log(obj,"obj");
      return find("nft", {
        // collectionContractAddress: obj.userAddress,
        collectionContractId: obj._id,
      }).then((nftObj) => {
        console.log(nftObj, "hello");
        return {
          ...obj._doc,
          nfts: nftObj,
        };
      });
    });

    const nftData = collection.map((obj) => {
      return find("nft", {
        collectionContractId: obj._id,
      }).then((nftObj) => {
        return {
          ...obj._doc,
          nfts: nftObj,
        };
      });
    });

    Promise.all(moralisData, nftData).then((values) => {
      return res.json({ status: 200, msg: values, ndbhit: values.length , total:totalLength});
    });
  } catch (error) {
    //   console.log(error);
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = getSingleUserCollection;
