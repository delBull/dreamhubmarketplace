const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const followSchema = new mongoose.Schema(
	{
		from: {
			type: SchemaType.ObjectID,
			ref: "user"
		},
		to: {
			type: SchemaType.ObjectID,
			ref: "user"
		},
		type: {
			type: SchemaType.TypeString
		}
	},
	{ timestamps: true }
);

module.exports = followSchema;
