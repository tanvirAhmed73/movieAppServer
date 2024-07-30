const express = require("express");
const userControler = require("../controllers/user");
const verifyUser = require("../middlewares/verifyUser");

const router = express.Router();

router.post("/signup", userControler.handleUserSignup);
router.post("/login", userControler.handleUserLogin);
router.post("/logOut", verifyUser, userControler.handleLogOut);

module.exports = router;
