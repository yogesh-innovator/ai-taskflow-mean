const express = require('express');
const {celebrate} = require('celebrate');
const {register, login, refresh} = 
require('../controllers/auth.controller');

const {authRateLimiter} = require('../middleware/rateLimit.middleware');
const {registerSchema, loginSchema, refreshSchema}
 = require('../validation/auth.validation');


const router = express.Router();

router.post('/register', authRateLimiter, celebrate(registerSchema), register);
router.post('/login', authRateLimiter, celebrate(loginSchema),  login);
router.post('/refresh',celebrate(refreshSchema), refresh);

module.exports = router;