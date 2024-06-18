const mongoose = require("mongoose");
const SchemaType = require("../../types/index");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: SchemaType.TypeString,
    },
    blogImage: {
      type: SchemaType.TypeString,
    },
    blogDescription: {
      type: SchemaType.TypeString,
    },
    blogData: {
      type: SchemaType.TypeString,
    },
    blogDate: {
      type: SchemaType.TypeDate,
      default: Date.now,
    },
    blogTags: {
      type: SchemaType.TypeArray,
      default: [],
    },
    userId: {
      type: SchemaType.ObjectID,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = blogSchema;
