const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'database.json');

let data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Delete category attributes gracefully across the db
data.menu = data.menu.map(({ category, ...item }) => item);

// Keep the items or optionally chop the list back down to smaller simple basics
// Using original basic set format
data.menu = data.menu.slice(0, 5); 

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log("Database reverted to un-categorized simple list.");
