import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, Clock } from 'lucide-react';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!pickupTime) {
      alert("Please select a pickup time!");
      return;
    }
    setLoading(true);

    // Mock payment confirmation delay
    setTimeout(async () => {
      try {
        const orderData = {
          studentId: user.id,
          items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity, price: item.price, name: item.name })),
          totalAmount: cartTotal,
          pickupTime
        };

        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        const data = await res.json();
        
        clearCart();
        setLoading(false);
        navigate('/student/confirmation', { state: { order: data } });

      } catch (err) {
        setLoading(false);
        alert('Payment failed or order error');
      }
    }, 1500); // 1.5s delay to mock payment gateway
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</h2>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/student/menu')}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Review Cart</h2>
      <div className="grid-cols-3">
        <div style={{ gridColumn: 'span 2' }}>
          {cart.map(item => (
            <div key={item.id} className="glass-panel" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '1rem' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ flex: 1, marginLeft: '1rem' }}>
                <h4>{item.name}</h4>
                <p style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>₹{item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                  style={{ width: '80px' }}
                />
                <button onClick={() => removeFromCart(item.id)} className="btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="glass-panel" style={{ position: 'sticky', top: '100px' }}>
            <h3>Checkout</h3>
            <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
            
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <span>Total Items</span>
              <span>{cart.reduce((c, i) => c + i.quantity, 0)}</span>
            </div>
            <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total Amount</span>
              <span className="text-gradient">₹{cartTotal}</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={16} /> Pickup Time
              </label>
              <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} required />
            </div>

            <button 
              className="btn-success" 
              style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} 
              onClick={handleCheckout}
              disabled={loading}
            >
              <CreditCard size={20} /> {loading ? 'Processing Payment...' : `Pay ₹${cartTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
