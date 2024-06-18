const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const followersSchema = new mongoose.Schema(
	{

		// userId: {
		// 	type: SchemaType.ObjectID,
		// 	ref: "users"
		// },
		profileId: {
			type: SchemaType.ObjectID,
			ref: "users"
		},
		followers: [
			{
			  type: SchemaType.ObjectID,
			  ref: "users",
			},
		  ],
		  following: [
			{
			  type: SchemaType.ObjectID,
			  ref: "users",
			},
		  ],
	},
	{ timestamps: true }
);

module.exports = followersSchema;
