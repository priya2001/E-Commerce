const errorHandler = (error, _req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    const message = error.message || "Internal server error";

    const response = {
        success: false,
        status,
        message,
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = error.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
