const mongoose = require("mongoose");
const schemaType = require("../../types");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: schemaType.TypeString,
      // unique: true,
    },
    first_Name: {
      type: schemaType.TypeString,
    },
    last_Name: {
      type: schemaType.TypeString,
    },
    full_Name: {
      type: schemaType.TypeString,
    },
    email: {
      type: schemaType.TypeString,
      // unique: true
    },
    bio: {
      type: schemaType.TypeString,
    },
    profile_img: {
      type: schemaType.TypeString,
    },
    cover_img: {
      type: schemaType.TypeString,
    },
    instagram: {
      type: schemaType.TypeString,
    },
    facebook: {
      type: schemaType.TypeString,
    },
    twitter: {
      type: schemaType.TypeString,
    },
    youtube: {
      type: schemaType.TypeString,
    },
    discord: {
      type: schemaType.TypeString,
    },
    tiktok: {
      type: schemaType.TypeString,
    },
    url: {
      type: schemaType.TypeString,
    },
    password: {
      type: schemaType.TypeString,
    },
    status: {
      type: schemaType.TypeString,
      default: "Active",
    },
    type: {
      type: schemaType.ObjectID,
      ref: "user-types",
    },
    followers: [
      {
        type: schemaType.ObjectID,
        ref: "users",
      },
    ],
    following: [
      {
        type: schemaType.ObjectID,
        ref: "users",
      },
    ],
    created_date: {
      type: schemaType.TypeDate,
      default: Date.now,
    },
    status: {
      type: schemaType.TypeString,
      enum: ["Active", "Disabled"],
      default: "Active",
    },
    // locations: {
    // 	type: [schemaType.TypeObjectId],
    // 	ref: "location"
    // }
  },
  { timestamps: true }
);

module.exports = userSchema;
