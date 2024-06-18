const Joi = require("joi");
const { getAggregate } = require("../../../helpers");

const schema = Joi.object({
  abstraction: Joi.string().required(),
});

const getNftByTag = async (req, res) => {
  try {
    await schema.validateAsync(req.query);
    const { abstraction } = req.query;
    const nftByTag = await getAggregate("nft", [
      {
        // $match: { tags: { $in: [new RegExp("^" + abstraction + "$", "i")] } },
        $match: { abstraction: new RegExp("^" + abstraction + "$", "i") },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ]);
    return res.status(200).send({ status: 200, nftByTag });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getNftByTag;
