const jwt = require("jsonwebtoken");
const redis = require("../configs/redis");
require("dotenv").config();

const verifyRefreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);

    const storedToken = await redis.getRefreshToken(payload.id);

    if (!storedToken || storedToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    req.userId = payload.id;
    next();
  } catch (err) {
    console.error("Refresh token verification failed", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, payload) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.userId = payload.id;
    next();
  });
};

module.exports = {
  verifyRefreshToken,
  authenticateToken,
};
