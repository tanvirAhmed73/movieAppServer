const User = require("../Model/userSchema");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function handleUserSignup(req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const isAlreadyExist = await User.findOne({ email: email });
    if (isAlreadyExist) {
      return res.status(400).send({
        success: false,
        message: "Already have a account with this email",
      });
    }
    const password = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name,
      email,
      password,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
}

async function handleUserLogin(req, res) {
  const email = req.body.email;
  try {
    // Find the user with login request
    const findUser = await User.findOne({ email: email });

    // If user exists
    if (findUser) {
      // Match user password
      const match = await bcrypt.compare(req.body.password, findUser.password);

      if (match) {
        const userId = findUser._id;
        const accessToken = jwt.sign(
          { userId },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "1m" }
        );
        const refreshToken = jwt.sign(
          { userId },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "2m" }
        );

        // set cookie with the refresh token
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        // Set cookie with the access token
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        // Send success response
        return res.status(200).send({
          success: true,
          message: "Login successful",
          user: findUser.name,
        });
      } else {
        // Incorrect password
        return res
          .status(401)
          .send({ success: false, message: "Incorrect password" });
      }
    } else {
      // User not found
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    // Send error response
    return res.status(400).send({ success: false, message: error.message });
  }
}

async function handleLogOut(req, res) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).send({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { handleUserSignup, handleUserLogin, handleLogOut };
