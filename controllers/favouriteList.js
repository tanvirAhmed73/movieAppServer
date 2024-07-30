const FavouriteList = require("../Model/favouriteListSchema");

async function getFavouriteList(req, res) {
  try {
    const favouriteList = await FavouriteList.find({});
    res.send(favouriteList);
  } catch (error) {
    console.error("Error retrieving favourite list:", error);
    throw error;
  }
}

module.exports = { getFavouriteList };
