const {verifyAccessToken} = require('../utils/jwt');
const {ApiError} = require('./error.middleware');

function authGuard(req, _res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(new ApiError(401, 'Authorization token missing or invalid'));
    }
    const token = authHeader.splits(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        req.user = {
            id:payload.sub,
            role: payload.role
        };
        return next();
    } catch(err){
        return next(new ApiError(401, 'Invalid or expired token'));
    }
}


// Optional role-baed guard

function requireRole(...allowedRoles){
    return (req, _res, next) => {
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return next(new ApiError(403, 'Forbidden'));
        }
        return next();
    };
}

module.exports = {
    authGuard,
    requireRole
}