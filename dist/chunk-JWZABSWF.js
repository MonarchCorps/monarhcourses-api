import {
  prisma_default
} from "./chunk-2JXIPJR2.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getErrorMessage
} from "./chunk-AJCKH6CJ.js";

// src/controllers/auth/registerController.ts
import bcrypt from "bcryptjs";
var register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "All fields are required"
      });
      return;
    }
    const duplicateEmail = await prisma_default.user.findUnique({
      where: { email }
    });
    if (duplicateEmail) {
      res.status(400).json({
        message: "Email is already in use"
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma_default.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
      error: getErrorMessage(error)
    });
  }
};

export {
  register
};
