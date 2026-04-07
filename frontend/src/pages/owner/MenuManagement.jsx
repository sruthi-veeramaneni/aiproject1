import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', imageUrl: '' });

  const fetchMenu = () => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setNewItem({ name: '', price: '', description: '', imageUrl: '' });
    fetchMenu();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/menu/${id}`, { method: 'DELETE' });
    fetchMenu();
  };

  const toggleAvailability = async (item) => {
    await fetch(`http://localhost:5000/api/menu/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !item.available })
    });
    fetchMenu();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Menu</h2>
      
      <div className="grid-cols-3">
        <div style={{ gridColumn: 'span 1' }}>
          <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
            <h3>Add New Item</h3>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <input type="number" placeholder="Price (₹)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
              <textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} rows={3} required />
              <input type="url" placeholder="Image URL (optional)" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} />
              <button type="submit" className="btn-primary"><Plus size={18} /> Add Item</button>
            </form>
          </div>
        </div>
        
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div key={item.id} className="glass-panel flex-between" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div>
                  <h4>{item.name} <span style={{ color: 'var(--accent-green)' }}>₹{item.price}</span></h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={item.available} onChange={() => toggleAvailability(item)} style={{ width: 'auto' }} />
                  {item.available ? 'Available' : 'Out of Stock'}
                </label>
                <button className="btn-danger" onClick={() => handleDelete(item.id)} style={{ padding: '0.5rem' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
