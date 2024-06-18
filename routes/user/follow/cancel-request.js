const Joi = require("joi");
const { findOne, deleteDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
	from: Joi.string().required()
});
const cancelRequest = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		const { from } = req.query;
		const check_user = await findOne("user", { _id: from });
		if (!check_user) {
			return res.status(404).send({ status: 404, message: "No User Found" });
		}
		const check_request = await findOne("follow", { from, to: req.userId, type: "Pending" });
		if (!check_request) {
			return res.status(404).send({ status: 404, message: "No Request Found" });
		}
		await deleteDocument("follow", { from, to: req.userId, type: "Pending" });
	saveActivity(`User ${from} cancelled request successfully`);
		return res.status(200).send({ status: 200, message: "request Deleted Successfully" });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = cancelRequest;
