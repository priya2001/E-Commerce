import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Please login first", 401));
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch {
        return next(new AppError("Invalid or expired token", 401));
    }
};

export default protect;
