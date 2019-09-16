const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  dateOfPost: {type: Number, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  createdBy: {type: String, required: true}
});

module.exports = mongoose.model("Blog", blogSchema);
