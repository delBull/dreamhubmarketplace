const { find, findOne } = require("../../../helpers");

const getUserCollections = async (req, res) => {
  try {
    const { userAddress, nftId } = req.body;

    const userCollections = await find("nft", {
      collectionContractAddress: userAddress,
    });

    if (userCollections.length < 1) {
      return res.status(404).send({
        status: 404,
        message: "Collections not found",
      });
    }
    // console.log(userCollections._id,"userCollections");
    // console.log(nftId,"nftId");

    const nftCollections = userCollections.filter((obj) =>
      console.log("64477ebba456cf38448e8624" !== "64477ebba456cf38448e8624", "hello")
    );

    //console.log(nftCollections,"nftCollections");
    return res.status(200).send({ status: 200, nftCollections });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getUserCollections;
