const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId },
    imageName: { type: String },
    image: { type: String },
    name: { type: String },
    avatar: { type: String },
    likes: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
