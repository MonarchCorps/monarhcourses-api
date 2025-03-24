const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    try {
        const accessToken = jwt.sign(
            {
                userId: userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );

        return accessToken
    } catch (error) {
        console.error(
            "Error generating access token:",
            error
        );
        return "";
    }
}

const generateRefreshToken = (userId) => {
    try {
        return jwt.sign(
            {
                userId
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "100d"
            }
        );
    } catch (error) {
        console.error(
            "Error generating refresh token:",
            error
        );
        return "";
    }
};

module.exports = { generateAccessToken, generateRefreshToken };
