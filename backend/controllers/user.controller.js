import User from "../models/user.model.js";

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, gender } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, gender },
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export default { getProfile, updateProfile };
