const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDb = require("./configs/mongodb");
const redis = require("./configs/redis");
require("dotenv").config();

connectDb();

redis.connectRedis();

const authRoutes = require("./routes/authRoutes");
const musicRoutes = require("./routes/musicRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8081",
    methods: "*",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
