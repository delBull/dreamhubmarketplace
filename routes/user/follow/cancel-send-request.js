const Joi = require("joi");
const { findOne, deleteDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
	to: Joi.string().required()
});
const cancelSendRequest = async (req, res) => {
	try {
		await schema.validateAsync(req.query);
		const { to } = req.query;
		const check_user = await findOne("user", { _id: to });
		if (!check_user) {
			return res.status(404).send({ status: 404, message: "No User Found" });
		}
		const check_request = await findOne("follow", { from: req.userId, to, type: "Pending" });
		if (!check_request) {
			return res.status(404).send({ status: 404, message: "No Request Found" });
		}
		await deleteDocument("follow", { from: req.userId, to, type: "Pending" });
		saveActivity(req, res, `User ${to} send request deleted successfully`);
		return res.status(200).send({ status: 200, message: "Send request Deleted Successfully" });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = cancelSendRequest;
