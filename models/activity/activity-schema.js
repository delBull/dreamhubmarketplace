const mongoose = require("mongoose");
const SchemaType = require("../../types");

const activitySchema = new mongoose.Schema(
  {
    user_id: {
      type: SchemaType.ObjectID,
     required: true,
    },
    date: {
      type: SchemaType.TypeNumber,
      required: true,
    },
    action: {
      type: SchemaType.TypeString,
     required: true,
    },
  },
  { timestamps: true }
);

module.exports = activitySchema;
