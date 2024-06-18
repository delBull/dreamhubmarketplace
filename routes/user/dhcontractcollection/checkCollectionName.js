const Joi = require("joi");
const { insertNewDocument, find } = require("../../../helpers");

const cloudinary = require("cloudinary").v2;

const schema = Joi.object({
  collection_name: Joi.string().required(),
});

const contractCollectionName = async (req, res) => {
  try {
    console.log(req.body, "req.body.......");
    await schema.validateAsync(req.body);
    console.log(req.body, "req....");

    const contractCheckCollection = await find("dhcontractcollection", {
      collection_name: req?.body?.collection_name,
    });

    console.log(contractCheckCollection, "contractCheckCollection");
    if (contractCheckCollection.length > 0) {
      return res.json({ status: 422, message: "Already available " });
    }

    return res.status(200).send({ status: 200, contractCheckCollection });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = contractCollectionName;
