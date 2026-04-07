const express = require('express');
const { readDb, writeDb, generateId } = require('../db');

const router = express.Router();

// Get all menu items
router.get('/', (req, res) => {
    const db = readDb();
    res.json(db.menuItems);
});

// Add a new menu item (Owner only)
router.post('/', (req, res) => {
    const { name, description, price, available, imageUrl } = req.body;
    const db = readDb();
    
    const newItem = {
        id: generateId(),
        name,
        description,
        price: Number(price),
        available: available !== undefined ? available : true,
        imageUrl: imageUrl || 'https://via.placeholder.com/150'
    };
    
    db.menuItems.push(newItem);
    writeDb(db);
    
    res.status(201).json(newItem);
});

// Update a menu item (Owner only)
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    const db = readDb();
    const itemIndex = db.menuItems.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        db.menuItems[itemIndex] = { ...db.menuItems[itemIndex], ...updates };
        writeDb(db);
        res.json(db.menuItems[itemIndex]);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// Delete a menu item
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    
    db.menuItems = db.menuItems.filter(item => item.id !== id);
    writeDb(db);
    
    res.json({ success: true });
});

module.exports = router;
