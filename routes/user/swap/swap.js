const Joi = require("joi");
const { find, findOne, updateDocument } = require("../../../helpers");

const schema = Joi.object({
  _id: Joi.string().required(),
  nftid: Joi.string().required(),
  swapid: Joi.string().required(),
  nftType: Joi.string(),
});




const swapNft = async (req, res) => {
  try {
    // await schema.validateAsync(req.query);
    const { ownerId, swapId, nftid, swapnftid } = req.query;

    console.log(req.query, "req.params...");

    const ownerUser = await findOne("user", { _id: ownerId });
    if (!ownerUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No Owner User found with your given id" });
    }

    console.log(ownerUser, "ownerUser....");

    const swapUser = await findOne("user", { _id: swapId });
    if (!swapUser) {
      return res
        .status(404)
        .send({ status: 404, message: "No Swap User found with your given id" });
    }

    console.log(swapUser, "swapUser....");




    const nftId = await findOne("nft", { owner: ownerUser._id, _id: nftid, nftType:"swap" });
    if (!nftId) {
      return res
        .status(404)
        .send({ status: 404, message: "No nft found with your given id" });
    }


    console.log(nftId, "nftid...");

    const swapnftId = await findOne("nft", { owner: swapUser._id, _id: swapnftid, nftType:"swap" });
    if (!swapnftId) {
      return res
        .status(404)
        .send({ status: 404, message: "No nft found with your given id" });
    }

    console.log(swapnftId, "swapnftid...");



    let obj = { id1: nftId.owner, id2: swapnftId.owner };

    // console.log(obj, "obj....");

    [obj.id1, obj.id2] = [obj.id2, obj.id1];

    console.log(obj.id1, "..........");




    const ownernft = await updateDocument("nft", {

      _id: nftid,
      owner: ownerId,
    },
      {
        owner: obj.id1,
        nftType:"mint",
        ...req.body
      },

    );

    console.log(ownernft, "ownernft...");

    const swapnft = await updateDocument("nft", {
      _id: swapnftid,
      owner: swapId,
    },
      {
        owner: obj.id2,
        nftType:"mint",
        ...req.body
      },

    );

    console.log(swapnft, "swapnft...");


    return res.status(200).send({ status: 200, ownerUser: ownernft, swapUser: swapnft });
  } catch (e) {

    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = swapNft;


