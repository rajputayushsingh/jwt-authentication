const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });

app.use("/api/auth", authRoutes);

app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        message: "This is a protected route",
        user: req.user
    });
});

app.get("/", (req, res) => {
    res.send("JWT Authentication Server is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});