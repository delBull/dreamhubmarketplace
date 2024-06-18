const Joi = require("joi");
const { find } = require("../../../helpers");

const schema = Joi.object({
	full_Name: Joi.string().required()
});
const searchUser = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		const { full_Name } = req.query;
		const users = await find("user", {
			full_Name: { $regex: new RegExp("^" + full_Name, "i") }
		});
		return res.status(200).send({ status: 200, users });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};

module.exports = searchUser;
