const mongoose = require("mongoose");

const favouriteListSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: String,
    year: String,
    quality: String,
    rating: String,
    image: String,
  },
  { timestamps: true }
);

const FavouriteList = mongoose.model(
  "FavouriteList",
  favouriteListSchema,
  "favouriteList"
);

module.exports = FavouriteList;
