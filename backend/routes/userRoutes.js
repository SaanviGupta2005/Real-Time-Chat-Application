const express = require("express");
const {
    registerUser,
    authUser,
    allUsers,
    sendOTP,
    verifyOTP,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);


module.exports = router;