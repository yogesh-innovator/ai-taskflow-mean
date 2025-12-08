const express = require('express');
const {authGuard, requireRole} = require('../middleware/auth.middleware');

const router = express.Router();

// Simple protected route
router.get('/me', authGuard, (req, res) => {
    res.json({
        status:'success',
        data: {
            userId: req.user.id,
            role : req.user.role,
            message:'You accessed a protected route',
        },
    });
});

// Admin-only example

router.get('/admin-only', authGuard, requireRole('admin'), (req, res) =>{
res.json({
    status:'success',
    data: {
        message: 'Admin-only route accessed',
    },
});
});

module.exports = router;