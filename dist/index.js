import {
  authRoute_default
} from "./chunk-HGXC5INK.js";
import {
  registerRoute_default
} from "./chunk-JXJBQMME.js";
import {
  verifyJWT_default
} from "./chunk-6QJIETK5.js";
import "./chunk-VIJ3TE6F.js";
import "./chunk-JWZABSWF.js";
import {
  prisma_default
} from "./chunk-2JXIPJR2.js";
import "./chunk-AJCKH6CJ.js";

// src/index.ts
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
dotenv.config();
var app = express();
var envPort = process.env.PORT;
var PORT = envPort ? parseInt(envPort) : 3500;
var cookieOptions = {
  decode: (val) => decodeURIComponent(val)
};
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_KEY, cookieOptions));
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/register/v1", registerRoute_default);
app.use("/auth/v1", authRoute_default);
app.use(verifyJWT_default);
var startServer = async () => {
  try {
    await prisma_default.$connect();
    console.log("Connected to Database successfully");
    app.listen(PORT, () => {
      console.log(`Server running on PORT: ${PORT}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      process.exit(1);
    } else {
      console.error("Unknown error", error);
    }
  }
};
startServer();
process.on("SIGINT", async () => {
  await prisma_default.$disconnect();
  console.log("Disconnected from DB");
  process.exit(0);
});
