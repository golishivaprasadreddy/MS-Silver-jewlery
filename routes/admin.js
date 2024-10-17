// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const router = express.Router();

// Admin Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// Admin Login Handle
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
    }

    // Match password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('/admin/login');
    }

    // Authentication success
    req.flash('success', 'You are logged in');
    res.redirect('/admin-dashboard'); // Redirect to the admin dashboard
});

module.exports = router;
