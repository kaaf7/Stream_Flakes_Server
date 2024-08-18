const router = require("express").Router();
const Media = require("./models/Media");
const { verifyTokenAndAuthorization } = require("./verifytoken");

router.post("/add", verifyTokenAndAuthorization, async (req, res) => {
  const requestUserId = req.query.id;
  const favorite = new Media({
    userId: qUserId,
    favorites: req.body.favorites,
    _id: requestUserId,
  });

  try {
    const savedFavorite = await favorite.save();
    res.status(200).json(savedFavorite);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/findfavorite", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const favorite = await Media.findOne({ userId: req.query.id });
    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/updatefavorite", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateFavorite = await Media.findOneAndUpdate(
      { userId: req.query.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateFavorite);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/get/delete", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ userId: req.query.id });
    res.status(200).json("deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
