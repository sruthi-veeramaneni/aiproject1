const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'database.json');
const seedPath = path.join(__dirname, 'seed.json');

// Initialize DB if it doesn't exist
const initDb = () => {
    if (!fs.existsSync(dbPath)) {
        if (fs.existsSync(seedPath)) {
            fs.copyFileSync(seedPath, dbPath);
            console.log('Database initialized with seed data.');
        } else {
            const initialData = {
                users: [],
                menuItems: [],
                orders: []
            };
            fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
            console.log('Database initialized empty.');
        }
    }
};

// Generic read
const readDb = () => {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
};

// Generic write
const writeDb = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = {
    initDb,
    readDb,
    writeDb,
    generateId: uuidv4
};
