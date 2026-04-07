import React, { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';

const VerifyHandover = () => {
  const [token, setToken] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setOrder(null);

    try {
      const res = await fetch('http://localhost:5000/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortToken: token.toUpperCase() })
      });
      const data = await res.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Invalid token or order not ready.');
      }
    } catch (err) {
      setError('Connection error.');
    }
  };

  const handleHandover = async () => {
    if (!order) return;
    
    try {
      await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'handover_completed' })
      });
      setSuccess(`Order delivered successfully! Token ${order.shortToken} consumed.`);
      setOrder(null);
      setToken('');
    } catch (err) {
      setError('Error updating order.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Verify Order Handover</h2>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleVerify} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Enter Unique 6-Char Token (e.g. A1B2C3)" 
            value={token}
            onChange={e => setToken(e.target.value.toUpperCase())}
            maxLength={6}
            required
            style={{ fontSize: '1.25rem', letterSpacing: '4px', textTransform: 'uppercase', textAlign: 'center' }}
          />
          <button type="submit" className="btn-primary">
            <Search size={20} /> Verify
          </button>
        </form>
        {error && <p style={{ color: 'var(--accent-red)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'var(--accent-green)', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
      </div>

      {order && (
        <div className="card glass-panel" style={{ border: '1px solid var(--accent-green)' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h3 className="text-gradient">Token Matched!</h3>
            <span className="badge badge-completed">Ready for Pickup</span>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Total Value: <b>₹{order.totalAmount}</b></p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.quantity}x {item.name}</li>
              ))}
            </ul>
          </div>
          
          <button className="btn-success" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handleHandover}>
            <CheckCircle size={24} /> Confirm Handover Complete
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyHandover;
