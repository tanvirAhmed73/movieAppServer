// modules
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user");
const favListController = require("./controllers/favouriteList");
const verifyUser = require("./middlewares/verifyUser");
const userObserve = require("./controllers/observeUser");
// loads enviroment variables
require("dotenv").config();

// port
const port = process.env.PORT || 3001;

// middlewares
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/user", userRouter);

// mongodb connection with mongoose
const uri =
  "mongodb+srv://movieApp:66An6vXH8elUnbKQ@cluster0.gumuqu0.mongodb.net/movieAppTest?appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

// Route to check authentication status
app.get("/checkAuth", verifyUser, userObserve.getobserverUser);

app.get("/favouriteList", favListController.getFavouriteList);

app.get("/", async (req, res) => {
  res.send("working");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
