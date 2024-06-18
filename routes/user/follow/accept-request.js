const { findOne, deleteDocument, customUpdate } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

const acceptRequest = async (req, res) => {
	try {
		const _id = req.params.id;
		const check_user = await findOne("user", { _id });
		if (!check_user) {
			return res.status(404).send({ status: 404, message: "No User Found" });
		}
		const check_request = await findOne("follow", { from: _id, to: req.userId, type: "Pending" });
		if (!check_request) {
			return res.status(404).send({ status: 404, message: "No Request Found" });
		}
		await deleteDocument("follow", { from: _id, to: req.userId, type: "Pending" });
		// For Updating User Followers
		await customUpdate("user", { _id: req.userId }, { $addToSet: { followers: _id } });
		// For Updating My Following
		await customUpdate("user", { _id }, { $addToSet: { following: req.userId } });
	 saveActivity(req, res, `User ${_id} follow request accepted successfully`);
		return res.status(200).send({ status: 200, message: "request accepted Successfully" });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};
module.exports = acceptRequest;
