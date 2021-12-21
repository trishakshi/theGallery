const express = require("express");
const Auth = require("../middleware/Auth");
const Image = require("../models/ImageModel");
const User = require("../models/UserModel");
const router = express.Router();

router.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    return res.status(500).send();
  }
});

router.get("/a_image", Auth, async (req, res) => {
  try {
    const image = await Image.find({ user: req.user });
    res.json(image);
  } catch (err) {
    return res.status(500).send();
  }
});

router.post("/images", Auth, async (req, res) => {
  try {
    const { imageName, image } = req.body;

    const user = await User.findOne({ _id: req.user });

    const existingImage = await Image.findOne(
      { image: image } || { imageName: imageName }
    );

    if (existingImage) {
      res.status(400).json({ err: "Image already exists." });
    } else {
      const postImage = new Image({
        user: req.user,
        imageName,
        image: image,
        name: user.name,
        avatar: user.avatar,
      });
      const postedImage = await postImage.save();
      res.json(postedImage);
    }
  } catch (err) {
    return res.status(500).send();
  }
});

router.put("/update", Auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const loggedUser = await Image.findOne({ user: req.user });

    loggedUser.avatar = avatar;
    const updatedUserInfo = await loggedUser.save();
    res.json(updatedUserInfo);
  } catch (err) {
    return res.status(500).send();
  }
});

// like an image
router.put("/:id/like", Auth, async (req, res) => {
  try {
    const imageId = req.params.id;
    const existingImage = await Image.findById({ _id: imageId });
    if (!existingImage.likes.includes(req.user)) {
      await existingImage.updateOne({ $push: { likes: req.user } });
      res.status(200).json("You liked this image.");
    } else {
      await existingImage.updateOne({ $pull: { likes: req.user } });
      res.status(200).json("You disliked this image.");
    }
  } catch (err) {
    return res.status(500).send();
  }
});

// delete an image
router.delete("/:id/delete", Auth, async (req, res) => {
  try {
    const imageId = req.params.id;
    const existingImage = await Image.findById({ _id: imageId });

    if (!existingImage) {
      return res.status(400).json({ err: "Image has already been deleted." });
    }

    existingImage.delete();
    res.json(existingImage);
  } catch (err) {
    return res.status(500).send();
  }
});

module.exports = router;
