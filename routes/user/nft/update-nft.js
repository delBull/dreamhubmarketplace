const Joi = require("joi");
const { findOne, updateDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
  nftId: Joi.string().required(),
  id: Joi.string().required(),
});

const UpdateNft = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { nftId, id } = req.query;
    const findUser = await findOne("user", { _id: id });
    if (!findUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No user found with your given id" });
    }
    const findNFT = await findOne("nft", { _id: nftId });
    if (!findNFT) {
      return res.status(404).send({ status: 404, message: "No NFT Found" });
    }
    await updateDocument("nft", { _id: nftId }, req.body);
    saveActivity(req, res, `User (${id}) this (${nftId}) Nft updated successfully`);
    return res.status(200).send({ status: 200, sell });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = UpdateNft;
