import authservice from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
    const user = await authservice.register(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

const login = asyncHandler(async (req, res) => {
    const { user, token } = await authservice.login(req.body);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
    const user = await authservice.verifyOtp(req.body);

    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

export default { register, login, verifyOtp };
