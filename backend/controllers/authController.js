const usersService = require("../services/usersService");
const authService = require("../services/authService");
const redis = require("../configs/redis");
const jwt = require("jsonwebtoken");
const parseTTL = require("../utils/parseTTL");
require("dotenv").config();
const validator = require('validator');

const REFRESH_TTL_S = parseTTL(process.env.REFRESH_EXPIRES_IN);
const ACCESS_TTL_S = parseTTL(process.env.ACCESS_EXPIRES_IN);
const REFRESH_TTL_MS = REFRESH_TTL_S * 1000;
const ACCESS_TTL_MS = ACCESS_TTL_S * 1000;

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Required fields are not provided" });

  if(!validator.isEmail(email)) return res.status(400).json({message: "Invalid email"});

  try {
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser)
      return res
        .status(409)
        .json({ message: "User with provided email already exists" });

    const hashedPassword = await authService.hashPassword(password);

    const user = await usersService.createUser(name, email, hashedPassword);

    const accessToken = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_EXPIRES_IN },
    );
    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_EXPIRES_IN },
    );

    await redis.saveRefreshToken(
      user._id.toString(),
      refreshToken,
      REFRESH_TTL_S,
    );

    return res
      .cookie("accessToken", accessToken.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TTL_MS,
      })
      .cookie("refreshToken", refreshToken.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TTL_MS,
      })
      .status(201)
      .json({ message: "Successfully registered and logged in" });
  } catch (err) {
    console.error("Failed to register user", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Required fields are not provided" });

  try {
    const existingUser = await usersService.getUserByEmail(email);
    if (!existingUser)
      return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await authService.comparePasswords(
      password,
      existingUser.password,
    );

    if (!isValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: existingUser._id.toString() },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_EXPIRES_IN },
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id.toString() },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_EXPIRES_IN },
    );
    await redis.saveRefreshToken(
      existingUser._id.toString(),
      refreshToken,
      REFRESH_TTL_S,
    );

    return res
      .cookie("accessToken", accessToken.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TTL_MS,
      })
      .cookie("refreshToken", refreshToken.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TTL_MS,
      })
      .status(200)
      .json({
        message: "Successfully logged in",
      });
  } catch (err) {
    console.error("Failed to login user", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refresh = async (req, res) => {
  try {
    const newAccessToken = jwt.sign(
      { id: req.userId },
      process.env.SECRET_ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_EXPIRES_IN },
    );

    const newRefreshToken = jwt.sign(
      { id: req.userId },
      process.env.SECRET_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_EXPIRES_IN },
    );

    await redis.saveRefreshToken(req.userId, newRefreshToken, REFRESH_TTL_S);

    return res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ACCESS_TTL_MS,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: REFRESH_TTL_MS,
      })
      .json({ message: "Tokens refreshed" });
  } catch (err) {
    console.error("Failed to refresh", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    await redis.deleteRefreshToken(req.userId);
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ message: "Logged out" });
  } catch (err) {
    console.error("Failed to logout", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
