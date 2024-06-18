const Joi = require("joi");
const { findOneSliceAndPopulate, getAggregate } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const schema = Joi.object({
	id: Joi.string().required(),
	page: Joi.number().required()
});

const getFollowers = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		let { id, page } = req.query;
		const lengthOfFollowers = await getAggregate("user", [
			{ $match: { _id: ObjectID(id) } },
			{ $project: { followers: { $size: "$followers" } } }
		]);
		// const arr = [0, lengthOfFollowers[0].followers];
		// if (arr.includes(page)) {
		// if (page != 0 && page != lengthOfFollowers[0].followers) {
		// 	page = page - 1;
		// }
		const user = await findOneSliceAndPopulate(
			"user",
			{ _id: id },
			{ followers: { $slice: [{ $reverseArray: "$followers" }, parseInt(page), parseInt(10)] } },
			"followers",
			"email profile_img username"
		);
		console.log({ user });
		if (!user) {
			return res.status(404).send({ status: 404, message: "No User Found" });
		}
		const { followers } = user;
		return res
			.status(200)
			.send({ status: 200, followers, lengthOfFollowers: lengthOfFollowers[0].followers });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = getFollowers;
