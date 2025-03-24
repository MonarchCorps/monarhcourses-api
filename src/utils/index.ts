import jwt from 'jsonwebtoken';

export function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

type UserId = string;

export const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const generateAccessToken = (userId: UserId): string => {
    try {
        const secret = getEnvVar('ACCESS_TOKEN_SECRET');

        const accessToken = jwt.sign(
            { userId },
            secret,
            { expiresIn: '1m' }
        );

        return accessToken;
    } catch (error: unknown) {
        console.error(
            'Error generating access token:',
            error instanceof Error ? error.message : error
        );
        return '';
    }
};

export const generateRefreshToken = (userId: UserId): string => {
    try {
        const secret = getEnvVar('REFRESH_TOKEN_SECRET');

        const refreshToken = jwt.sign(
            { userId },
            secret,
            { expiresIn: '4m' }
        );

        return refreshToken;
    } catch (error: unknown) {
        console.error(
            'Error generating refresh token:',
            error instanceof Error ? error.message : error
        );
        return '';
    }
};
