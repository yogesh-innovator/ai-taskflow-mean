const {Joi, Segments} = require('celebrate');
const registerSchema = {
    [Segments.BODY] : Joi.object({
name: Joi.string().min(2).max(100).required(),
email: Joi.string().email().required(),
password: Joi.string().min(8).max(128).required(),
role: Joi.string().valid('admin', 'manager', 'user').optional(),
    }),
};

const loginSchema = {
    [Segments.BODY]: Joi.object({
        email:Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
    }),
};

const refreshSchema = {
    [Segments.BODY] : Joi.object({
        refreshToken : Joi.string().required(),
    }),
};

module.exports = {
    registerSchema,
    loginSchema,
    refreshSchema,
}
