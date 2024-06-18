const Joi = require("joi");
const { findPopulateSortAndLimit } = require("../../../helpers");

const schema = Joi.object({
	page: Joi.string().required()
});

const getRequests = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		const { page } = req.query;
		const getRequest = await findPopulateSortAndLimit(
			"follow",
			{ to: req.userId },
			"from",
			"name email profile_img",
			{
				_id: -1
			},
			page,
			10
		);
		return res.status(200).send({ status: 200, getRequest });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = getRequests;
