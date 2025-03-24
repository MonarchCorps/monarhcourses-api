const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateRefreshToken, generateAccessToken } = require("../../utils/tokens")

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ message: "All fields are required" })

    try {
        const user = await User.findOne({
            $or: [
                { email: email }
            ]
        })
        if (!user)
            return res.status(400).json({ message: "Incorrect email or password" })

        const match = await bcrypt.compare(password, user.password)

        if (!match)
            return res.status(400).json({ message: "Incorrect email or password" })

        const refreshToken = generateRefreshToken(user._id)
        const accessToken = generateAccessToken(user._id)

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email
            },
            refreshToken,
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            message: 'Failed to login',
            error: error.message
        })
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken)
        return res.status(400).json({ message: "Refresh token is required" })

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded.userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const accessToken = generateAccessToken(user._id)

        res.status(200).json(accessToken)

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to logout",
            error: error.message
        })
    }
}

module.exports = { login, refreshToken, logout }