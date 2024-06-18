const { find, findOne, getAggregate } = require("../../../helpers");

const { ObjectID } = require("../../../types");

const getswapNftOffer = async (req, res) => {
    try {
        const { nftContractAddress, tokenId } = req.query;
        console.log(req.params, "swapnft.......");
        // const check_nft = await findOne("nft", { _id: nft_id });
        // if (!check_nft) {
        //     return res.status(404).send({ status: 404, message: "NFT not found" });
        // }


        const swapnft = await getAggregate("swapbid", [
            {
                $match: { nftContractAddress: nftContractAddress, tokenId: tokenId },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "bidder_id",
                    foreignField: "_id",
                    as: "bidderObject",
                },

            },
            {
                $lookup: {
                    from: "nfts",
                    localField: "biddernft_id",
                    foreignField: "_id",
                    as: "nftObject",
                },
            }
        ]);
console.log(swapnft, "hello");
        // const swapnft = await find("swapbid", { nftContractAddress:nftContractAddress, tokenId:tokenId });


        // console.log(swapnft, "swapnft");
        // if (!swapnft) {
        //     return res.status(404).send({ status: 404, message: "SwapNFT not found" });
        // }


        return res.status(200).send({ status: 200, swapnft });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 500, message: e.message });
    }
};

module.exports = getswapNftOffer;
