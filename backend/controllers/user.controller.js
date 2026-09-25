import User from "../models/user.model.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json({ success: true, user });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, gender } = req.body;

    const user = await User.findByIdAndUpdate(
        req.userId,
        { name, phone, gender },
        { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
});

export default { getProfile, updateProfile };
