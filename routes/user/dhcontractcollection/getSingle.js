const { find } = require("../../../helpers");

const getContractCollection = async (req, res) => {
  try {
    const { userAddress } = req.body;

    const userCollection = await find("dhcontractcollection", {
      // userAddress: userAddress,
      wallet_address: userAddress, //new line added bby umer
    });


    if (userCollection.length < 1) {
      return res.status(200).send({
        status: 200,
        message: "Collection not found",
      });
    }

    return res.status(200).send({ status: 200, userCollection });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getContractCollection;
