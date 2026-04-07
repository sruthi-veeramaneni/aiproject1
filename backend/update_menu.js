const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db', 'database.json');

const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

data.menu = [
  { id: 'm1', name: 'Masala Dosa', price: 50, description: 'Crispy crepe with potato filling', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500', available: true, category: 'Tiffins' },
  { id: 'm2', name: 'Idli Sambar', price: 30, description: 'Steamed rice cakes with lentil soup', imageUrl: 'https://images.unsplash.com/photo-1589301760019-d2d09558d6e3?w=500', available: true, category: 'Tiffins' },
  { id: 'm3', name: 'Puri Sabji', price: 40, description: 'Deep fried bread with potato curry', imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500', available: true, category: 'Tiffins' },
  { id: 'm4', name: 'Chicken Biryani', price: 150, description: 'Aromatic basmati rice cooked with spiced chicken', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', available: true, category: 'Rices' },
  { id: 'm5', name: 'Veg Pulao', price: 80, description: 'Mildly spiced rice with mixed vegetables', imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb4c1133c9?w=500', available: true, category: 'Rices' },
  { id: 'm6', name: 'Curd Rice', price: 50, description: 'Tempered yogurt mixed with rice', imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500', available: true, category: 'Rices' },
  { id: 'm7', name: 'Paneer Butter Masala', price: 120, description: 'Rich tomato gravy with paneer cubes', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500', available: true, category: 'Curries' },
  { id: 'm8', name: 'Chicken Curry', price: 130, description: 'Homestyle chicken gravy', imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500', available: true, category: 'Curries' },
  { id: 'm9', name: 'South Indian Thali', price: 100, description: 'Complete meal with rice, sambar, rasam, curries', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500', available: true, category: 'Meals' },
  { id: 'm10', name: 'North Indian Thali', price: 120, description: 'Complete meal with roti, dal, paneer, and rice', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500', available: true, category: 'Meals' },
  { id: 'm11', name: 'Filter Coffee', price: 20, description: 'Strong authentic South Indian coffee', imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500', available: true, category: 'Coffees' },
  { id: 'm12', name: 'Masala Chai', price: 15, description: 'Spiced Indian milk tea', imageUrl: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500', available: true, category: 'Coffees' },
  { id: 'm13', name: 'Fresh Mango Juice', price: 40, description: 'Freshly squeezed seasonal mangoes', imageUrl: 'https://images.unsplash.com/photo-1625501314959-1e37bc62d6b3?w=500', available: true, category: 'Juices' },
  { id: 'm14', name: 'Samosa', price: 15, description: 'Crispy pastry with spiced potato filling', imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', available: true, category: 'Snacks' }
];

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log("Database updated with categorized menu items.");
