const Joi = require("joi");
const saveActivity = require("../../../middleware/activity/save-activity");
const {
    insertNewDocument,
    deleteDocument,
    findOne,
    updateDocument,
} = require("../../../helpers");

const schema = Joi.object({
    owner: Joi.string().required(),
    buyer: Joi.string().required(),
    buynftnumber: Joi.number().required(),
});

const multipleNft = async (req, res) => {
    try {
        await schema.validateAsync(req.query);
        const { owner, buyer, buynftnumber } = req.query;
        const findUser = await findOne("user", { _id: buyer });
        if (!findUser) {
            return res
                .status(404)
                .send({ status: 404, message: "No user found with your given id" });
        }

        const findNFT = await findOne("nft", { _id: owner });
        if (!findNFT) {
            return res.status(404).send({ status: 404, message: "No NFT Found" });
        }

        const checkOnSell = await findOne("nft", {
            _id: owner,
            nftType: { $in: ["sell", "bid"] },
        });

        if (!checkOnSell) {
            return res
                .status(404)
                .send({ status: 404, message: "This nft is not on sell" });
        }


        const newbuyer = await insertNewDocument(
            "multipleUser",
            // { _id: owner },
            {
                //nftType: findNFT.nftType,
                buynftnumber: buynftnumber,
                owner: owner,
                buyer: buyer,
            }
        );

console.log(newbuyer,"newbuyer....");


        return res.status(200).send({ status: 200, newbuyer });
    } catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: e.message });
    }
};
module.exports = multipleNft;

