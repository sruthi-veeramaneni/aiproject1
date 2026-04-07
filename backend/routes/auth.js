const express = require('express');
const { readDb, writeDb, generateId } = require('../db');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDb();
    
    // In a real app, passwords should be hashed and we'd use JWTs
    const user = db.users.find(u => (u.email === email || u.username === email) && u.password === password);
    
    if (user) {
        // Send back user without password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const db = readDb();
    
    // Check if user already exists
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        role
    };

    db.users.push(newUser);
    writeDb(db);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, user: userWithoutPassword });
});

module.exports = router;
