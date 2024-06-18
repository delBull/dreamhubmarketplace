const { find } = require("../../../helpers/index");



const getSwapNft = async (req, res) => {
    try {

        const { nftType } = req.query
        const getSwapnfts = await find("nft", { nftType: new RegExp(nftType, "i") })
        if (!getSwapnfts) {
            return res.json({ status: "400", messsage: "No swap nft founds" });
        }


        const multipleUserswap = await find("multipleUser", { nftType: new RegExp(nftType, "i") })
        if (!multipleUserswap) {
            return res.json({ status: "400", messsage: "No swap nft founds" });
        }



        return res.json({ status: "200", message: getSwapnfts });
    } catch (error) {
        return res.json({ status: "500", message: error.message });
    };
};


module.exports = getSwapNft