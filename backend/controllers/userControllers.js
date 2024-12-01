const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpCache = {}; // Use Redis for production

// Fetch all users except the logged-in user
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields.");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists.");
    }

    const user = await User.create({ name, email, password, pic });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User creation failed.");
    }
});

// Authenticate a user
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
});

// Send OTP
const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error("Email is required.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    otpCache[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP for login is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully!" });
});

// Verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!otpCache[email] || otpCache[email].expiresAt < Date.now()) {
        res.status(400);
        throw new Error("OTP expired. Request a new one.");
    }

    if (otpCache[email].otp === parseInt(otp)) {
        delete otpCache[email]; // Clear OTP after verification
        res.status(200).json({ message: "OTP verified successfully!" });
    } else {
        res.status(400);
        throw new Error("Invalid OTP.");
    }
});

module.exports = { allUsers, registerUser, authUser, sendOTP, verifyOTP };
