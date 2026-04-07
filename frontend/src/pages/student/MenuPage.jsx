import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, ShoppingCart, Search, Zap, X, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [buyNowItem, setBuyNowItem] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data.filter(item => item.available)));
  }, []);

  const filteredMenu = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDirectCheckout = async () => {
    if (!pickupTime) {
      alert("Please select a pickup time!");
      return;
    }
    setLoading(true);

    setTimeout(async () => {
      try {
        const orderData = {
          studentId: user.id,
          items: [{ menuItemId: buyNowItem.id, quantity: buyQuantity, price: buyNowItem.price, name: buyNowItem.name }],
          totalAmount: buyNowItem.price * buyQuantity,
          pickupTime
        };

        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        const data = await res.json();
        
        setLoading(false);
        setBuyNowItem(null);
        navigate('/student/confirmation', { state: { order: data } });

      } catch (err) {
        setLoading(false);
        alert('Payment failed or order error');
      }
    }, 1500);
  };

  return (
    <div>
      {buyNowItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-panel fade-in" style={{ width: '400px', background: 'var(--bg-secondary)', padding: '2rem' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Instant Checkout</h3>
              <button className="btn-outline" onClick={() => setBuyNowItem(null)} style={{ padding: '0.25rem', border: 'none' }}><X size={18} /></button>
            </div>
            
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{buyNowItem.name}</p>
            
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <span>Quantity</span>
              <input type="number" min="1" value={buyQuantity} onChange={e => setBuyQuantity(parseInt(e.target.value))} style={{ width: '80px', padding: '0.5rem' }} />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={16} /> Pickup Time
              </label>
              <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} required />
            </div>

            <div className="flex-between" style={{ padding: '1rem 0', borderTop: '1px solid var(--glass-border)', fontSize: '1.25rem' }}>
              <span>Total Pay</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>₹{buyNowItem.price * buyQuantity}</span>
            </div>
            
            <button className="btn-success" style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }} onClick={handleDirectCheckout} disabled={loading}>
              <CreditCard size={18} /> {loading ? 'Processing Payment...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}

      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2>Menu</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '250px' }}
            />
          </div>
          <button className="btn-primary" onClick={() => navigate('/student/cart')}>
            <ShoppingCart size={20} /> View Cart ({cartCount})
          </button>
        </div>
      </div>

      <div className="grid-cols-3">
        {filteredMenu.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No items found.</p>
        ) : (
          filteredMenu.map(item => (
          <div key={item.id} className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3>{item.name}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '3rem' }}>{item.description}</p>
              <div className="flex-between">
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>₹{item.price}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-success" onClick={() => { setBuyNowItem(item); setBuyQuantity(1); setPickupTime(''); }} style={{ padding: '0.5rem 1rem' }}>
                    <Zap size={18} /> Buy Now
                  </button>
                  <button className="btn-primary" onClick={() => addToCart(item)} style={{ padding: '0.5rem 1rem' }}>
                    <Plus size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuPage;
