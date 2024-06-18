const Joi = require("joi");
const { findOne, customUpdate, insertNewDocument } = require("../../../helpers");
const saveActivity = require("../../../middleware/activity/save-activity");

const schema = Joi.object({
	follow: Joi.boolean().required()
});

const follow = async (req, res) => {
	try {
		await schema.validateAsync(req.body);
		const { follow } = req.body;
		const _id = req.params.id;
		console.log(req.userId);
		if (_id === req.userId) {
			return res.status(400).send({ status: 400, message: "You can't follow yourself" });
		}
		const find_user = await findOne("user", { _id });
		if (!find_user) {
			return res.status(400).send({ status: 400, message: "No user found" });
		}
		if (follow) {
			const check_followed = await findOne("user", {
				_id,
				followers: {
					$in: [req.userId]
				}
			});
			if (check_followed) {
				return res.status(400).send({ status: 400, message: "You already followed this user" });
			}
			// check request is on pending
			const check_request = await findOne("follow", {
				from: req.userId,
				to: _id
			});
			if (check_request?.type === "Pending") {
				return res.status(400).send({ status: 400, message: "Your Request is on Pending" });
			}
			const request = await insertNewDocument("follow", {
				from: req.userId,
				to: _id,
				type: "Pending"
			});
			// // For Updating User Followers
			// await customUpdate("user", { _id }, { $addToSet: { followers: req.userId } });
			// // For Updating My Following
			// await customUpdate("user", { _id: req.userId }, { $addToSet: { following: _id } });
			return res
				.status(200)
				.send({ status: 200, request, message: "Follow request send Successfully" });
		}
		if (!follow) {
			const check_followed = await findOne("user", {
				_id,
				followers: {
					$in: [req.userId]
				}
			});
			if (!check_followed) {
				return res.status(400).send({ status: 400, message: "You have not followed this user" });
			}
			// For Updating User Followers
			await customUpdate("user", { _id }, { $pull: { followers: req.userId } });
			// For Updating My Following
			await customUpdate("user", { _id: req.userId }, { $pull: { following: _id } });
		 saveActivity(req, res, `User ${follow} unfollowed request successfully`)
			return res.status(200).send({ status: 200, message: "UnFollowed user Successfully" });
		}
		// return res.status(400).send({ status: 400, message: "Beta Wrong Input" });
	} catch (e) {
		console.log(e);
		return res.status(400).send({ status: 400, message: e.message });
	}
};

module.exports = follow;
