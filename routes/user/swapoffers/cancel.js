const Joi = require("joi");
const { findOne, deleteDocument, getAggregate } = require("../../../helpers");


const schema = Joi.object({
    bid_id: Joi.string().required(),
    bidder_id: Joi.string().required(),
});

const cancelBid = async (req, res) => {
    try {
        await schema.validateAsync(req.body);
        const { bid_id, bidder_id } = req.body;
        const check_bid = await findOne("swapbid", {
            _id: bid_id,
            bidder_id,
        });
        if (!check_bid) {
            return res.status(404).send({ status: 404, message: "no Swap bid found" });
        }
        const cancelBid = await deleteDocument("swapbid", { _id: bid_id });
        req.io.emit(check_bid?.nft_id.valueOf() + "cancelbid", {
            id: check_bid._id,
        });

        return res
            .status(200)
            .send({ status: 200, cancelBid, message: "Swap Bid cancelled successfully" });
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 500, message: e.message });
    }
};

module.exports = cancelBid;
