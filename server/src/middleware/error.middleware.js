// Simple API error class

class ApiError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}

// 404 handler

function notFoundHandler(req, res, next){
    res.status(404).json({
        status:'error',
        message:'Not Found',
        path: req.orignalUrl,
    });
}

// Central error handler
function errorHandler(err, req, res, _next){
    console.error('❌ API Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        status: 'error',
        message,
    });
}

module.exports = {
    ApiError,
    notFoundHandler,
    errorHandler
};