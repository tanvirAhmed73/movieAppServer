const User = require("../Model/userSchema");
const jwt = require("jsonwebtoken");

async function verifyUser(req, res, next) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).send({
      success: false,
      message: "Access token and refresh token not found",
    });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    if (decoded) {
      // console.log("Access token verified");
      const userId = decoded.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }
      req.user = user;
      return next();
    }
  } catch (error) {
    if (error.name === "TokenExpiredError" && refreshToken) {
      // console.log(
      //   "Access token expired, attempting to verify refresh token..."
      // );
      try {
        const decodedRefresh = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        const userId = decodedRefresh.userId;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        // Create a new access token
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: "10m" }
        );

        // console.log("New access token created:", newAccessToken);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: false, // Set to true in production with HTTPS
          sameSite: "strict",
        });

        req.user = user;
        return next();
      } catch (refreshError) {
        console.error("Error verifying refresh token:", refreshError.message);
        return res
          .status(401)
          .send({ success: false, message: "Invalid refresh token" });
      }
    } else {
      console.error("Error verifying access token:", error.message);
      return res
        .status(401)
        .send({ success: false, message: "Invalid access token" });
    }
  }
}

module.exports = verifyUser;
