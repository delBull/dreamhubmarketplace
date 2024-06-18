const Joi = require("joi");
const { find, findOne, getAggregate, axiosGetCall } = require("../../../helpers");
const { ObjectID } = require("../../../types");
const Moralis = require("moralis").default;

const schema = Joi.object({

    collection_address: Joi.string().required(),
    chain: Joi.string().required()
});

const getNftCollection = async (req, res) => {
    try {
        await schema.validateAsync(req.query);
        const { collection_address, chain, nft_tokenId } = req.query;
        console.log({ collection_address, chain });

        const response = await Moralis.EvmApi.nft.getNFTMetadata({
            address: collection_address,
            chain,
            tokenId: nft_tokenId
        });

        const tokenUriData = await axiosGetCall(response.toJSON()?.token_uri);
        let data = {};
        data = {
            ...response.toJSON(),
            metadata: tokenUriData,
        };


        const nftCollection = await find("nftcollection", { collection_address, chain });


        if (!nftCollection) {
            return res
                .status(200)
                .json({ status: 500, msg: "Oops no data found" });
        }

        nftCollection.push(data)

        return res
            .status(200)
            .json({ status: 200, nftCollection: data, moralis: true });
    }

    catch (e) {
        console.log(e);
        return res.status(400).send({ status: 400, message: e.message });
    }
};

module.exports = getNftCollection;



