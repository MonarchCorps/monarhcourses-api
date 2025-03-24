import type { Request, Response } from "express"
import prisma from "../../prisma/index"
import { AuthRequestBody } from "../../types/Auth"
import {
    generateAccessToken,
    generateRefreshToken,
    getEnvVar,
    getErrorMessage
} from "../../utils";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JwtPayload } from "../../middlewares/verifyJWT";

const login = async (
    req: Request<{}, {}, AuthRequestBody>,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" })
            return;
        }

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if (!user) {
            res.status(400).json({ message: "Incorrect email or password" });
            return;
        }

        const match: boolean = await bcrypt.compare(password, user.password)

        if (!match) {
            res.status(400).json({ message: "Incorrect email or password" });
            return;
        }

        const accessToken: string = generateAccessToken(user?.id)
        const refreshToken: string = generateRefreshToken(user.id)

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to login",
            error: getErrorMessage(error)
        })
    }
}

const refresh = async (
    req: Request<{}, {}, { refreshToken: string }>,
    res: Response
): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(
                refreshToken,
                getEnvVar("REFRESH_TOKEN_SECRET")
            ) as JwtPayload;
        } catch (err: any) {
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
            return; // Exit early if token verification fails
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
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

const logout = async (
    req: Request,
    res: Response
) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to logout",
            error: getErrorMessage(error)
        })
    }
}

export { login, refresh, logout }