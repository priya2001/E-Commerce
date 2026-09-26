import AppError from "../utils/appError.js";

const adminOnly = (req, res, next) => {
    if (req.userRole !== "admin") {
        return next(new AppError("Admin access required", 403));
    }

    next();
};

export default adminOnly;
