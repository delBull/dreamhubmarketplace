const Joi = require("joi");
const { findOneSliceAndPopulate, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const schema = Joi.object({
	id: Joi.string().required(),
	page: Joi.number().required()
});

const getFollowing = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		let { id, page } = req.query;
		const lengthOfFollowing = await getAggregate("user", [
			{ $match: { _id: ObjectID(id) } },
			{ $project: { following: { $size: "$following" } } }
		]);
		// const arr = [0, lengthOfFollowing[0].following];
		// if (arr.includes(page)) {
		if (page != 0 && page != lengthOfFollowing[0].following) {
			page = page - 1;
		}
		const user = await findOneSliceAndPopulate(
			"user",
			{ _id: id },
			{ following: { $slice: [{ $reverseArray: "$following" }, parseInt(page), parseInt(10)] } },
			"following",
			"email profile_img name telephone"
		);
		if (!user) {
			return res.status(404).send({ status: 404, message: "No User Found" });
		}
		const { following } = user;
		return res
			.status(200)
			.send({ status: 200, following, lengthOfFollowing: lengthOfFollowing[0].following });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = getFollowing;
