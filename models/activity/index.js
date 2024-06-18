const mongoose = require("mongoose");
const activitySchema = require("./activity-schema");

const activity = mongoose.model("activity", activitySchema);

module.exports = activity;
