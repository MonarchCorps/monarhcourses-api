import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload, Secret } from "jsonwebtoken";

export interface JwtPayload extends DefaultJwtPayload {
    userId: string;
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader.split(' ')[1];

    const secret: Secret = process.env.ACCESS_TOKEN_SECRET as string;

    jwt.verify(
        token,
        secret,
        (err, decoded) => {
            if (err || !decoded) {
                res.sendStatus(403);
                return;
            }

            const payload = decoded as JwtPayload;
            req.userId = payload.userId;
            next();
        }
    );
};

export default verifyJWT;