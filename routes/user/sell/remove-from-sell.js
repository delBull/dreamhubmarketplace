const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");

const {
  findOne,
  updateDocument,
  customUpdate,
  insertNewDocument,
} = require("../../../helpers");

const schema = Joi.object({
  nftId: Joi.string().required(),
  id: Joi.string().required(),
});

const removeFromSell = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { nftId, id } = req.query;
    console.log(req.body);
    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    const findNFT = await findOne("nft", { _id: nftId, owner: id });
    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }
    const checkNftOnMint = await findOne("nft", {
      _id: nftId,
      owner: id,
      mintType: "mint",
    });
    if (checkNftOnMint) {
      return res
        .status(404)
        .send({ status: 404, message: "This nft is not on sell" });
    }
    const sell = await updateDocument(
      "nft",
      { _id: nftId },
      {
        mintType: "mint",
      }
    );
    const history = await insertNewDocument("history", {
      nft_id: nftId,
      action: "shift from list to mint",
      from: id,
    });
 saveActivity(req, res, `User (${id}) removed this ${sell._id} NFT from sell successfully`);
    return res.status(200).send({ status: 200, sell });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = removeFromSell;
