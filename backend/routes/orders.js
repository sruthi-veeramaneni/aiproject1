const express = require('express');
const { readDb, writeDb, generateId } = require('../db');

const router = express.Router();

// Generate a 6-character short unique ID for verification
const generateShortToken = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Get all orders (Owner view)
router.get('/', (req, res) => {
    const db = readDb();
    const ordersWithNames = db.orders.map(order => {
        const student = db.users.find(u => u.id === order.studentId);
        return {
            ...order,
            studentName: student ? student.name || student.email : 'Unknown'
        };
    });
    res.json(ordersWithNames);
});

// Get orders for a specific student
router.get('/student/:studentId', (req, res) => {
    const { studentId } = req.params;
    const db = readDb();
    const studentOrders = db.orders.filter(o => o.studentId === studentId);
    res.json(studentOrders);
});

// Verify order handover (Owner)
router.post('/verify', (req, res) => {
    const { shortToken } = req.body;
    const db = readDb();
    
    const order = db.orders.find(o => o.shortToken === shortToken && o.status === 'preparing_completed');
    
    if (order) {
        res.json({ success: true, order });
    } else {
        res.status(404).json({ success: false, message: 'Invalid token or order not ready for handover' });
    }
});

// Update order status (Owner)
router.patch('/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const db = readDb();
    const orderIndex = db.orders.findIndex(o => o.id === id);
    
    if (orderIndex > -1) {
        db.orders[orderIndex].status = status; // e.g., 'preparing_completed', 'handover_completed'
        writeDb(db);
        res.json(db.orders[orderIndex]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

// Create a new order (Student)
router.post('/', (req, res) => {
    const { studentId, items, totalAmount, pickupTime } = req.body;
    
    if (!studentId || !items || !pickupTime) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = readDb();
    const newOrder = {
        id: generateId(),
        studentId,
        items, // array of { menuItemId, quantity, price, name }
        totalAmount,
        pickupTime,
        status: 'pending', // pending -> preparing_completed -> handover_completed
        shortToken: generateShortToken(),
        createdAt: new Date().toISOString()
    };
    
    db.orders.push(newOrder);
    writeDb(db);
    
    res.status(201).json(newOrder);
});

module.exports = router;
