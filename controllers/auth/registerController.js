const User = require("../../models/User")
const bcrypt = require('bcryptjs')
const { generateRefreshToken, generateAccessToken } = require("../../utils/tokens")

const register = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ message: "All fields are required" })

    try {
        const duplicateDetails = await User.findOne({
            $or: [
                { email }
            ]
        });

        if (duplicateDetails)
            return res.status(400).json({ message: "Email is already in use!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        const refreshToken = generateRefreshToken(newUser._id);
        const accessToken = generateAccessToken(newUser._id);

        res.status(200).json({
            user: {
                _id: newUser._id,
                email: newUser.email
            },
            refreshToken,
            accessToken
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to create account",
            error: error.message
        })
    }
}

module.exports = { register }