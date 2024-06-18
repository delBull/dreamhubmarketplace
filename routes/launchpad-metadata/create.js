const Joi = require("joi");

const { insertNewDocument } = require("../../helpers");
const cloudinary = require("cloudinary").v2;

const validationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  external_url: Joi.string(),
  symbol: Joi.string(),
  launchpad_image: Joi.string(),
  attributes: Joi.array(),
});

const createMetaData = async (req, res) => {
  try {
    await validationSchema.validateAsync(req.body);
    console.log(req.body);

    if (!req?.body?.launchpad_image) {
      return res.status(400).json({
        status: 400,
        message: "nft Image is required",
      });
    } else {
      const createDbObject = await insertNewDocument(
        "launchpadMetaData",
        req.body
      );

      return res.status(200).json({
        status: 200,
        message: "nft metadata created successfully",
        data: createDbObject,
        url: `https://dreamhub-server.herokuapp.com/api/v1/launchpad-metadata/${createDbObject._id}`,
      });
    }
    // const cloudObj = await cloudinary.uploader.upload(
    //     req?.body?.launchpad_image.path,
    //   { quality: 20 }
    // );
    // req.body.image = cloudObj.url;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 500, message: e.message });
  }
};

module.exports = createMetaData;
