import AppError from "../utils/appError.js";

function notFoundMiddleware(req, res, next) {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
}
export default notFoundMiddleware;