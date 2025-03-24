require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connectDB = require("./configs/dbConnection")
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3500

const app = express()

connectDB()

app.use(cookieParser());

app.use(express.json());

app.use('/', require('./routes/root'));

app.use('/auth/v1', require('./routes/auth/authRoute'))
app.use('/register/v1', require('./routes/auth/registerRoute'))

mongoose.connection.on("open", () => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
    })
})

mongoose.connection.on("error", (error) => {
    console.log(error)
})