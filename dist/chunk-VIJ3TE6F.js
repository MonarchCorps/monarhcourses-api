import {
  prisma_default
} from "./chunk-2JXIPJR2.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getEnvVar,
  getErrorMessage
} from "./chunk-AJCKH6CJ.js";

// src/controllers/auth/authController.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    const user = await prisma_default.user.findFirst({
      where: { email }
    });
    if (!user) {
      res.status(400).json({ message: "Incorrect email or password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ message: "Incorrect email or password" });
      return;
    }
    const accessToken = generateAccessToken(user?.id);
    const refreshToken = generateRefreshToken(user.id);
    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login",
      error: getErrorMessage(error)
    });
  }
};
var refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        getEnvVar("REFRESH_TOKEN_SECRET")
      );
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        res.status(401).json({ message: "Refresh token expired" });
      } else if (err.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid refresh token" });
      } else {
        res.status(400).json({
          message: "Could not verify token",
          error: getErrorMessage(err)
        });
      }
      return;
    }
    const user = await prisma_default.user.findUnique({
      where: { id: decoded.userId }
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const accessToken = generateAccessToken(user.id);
    res.status(200).json(accessToken);
  } catch (error) {
    res.status(500).json({
      message: "Server error while refreshing token",
      error: getErrorMessage(error)
    });
  }
};
var logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to logout",
      error: getErrorMessage(error)
    });
  }
};

export {
  login,
  refresh,
  logout
};
