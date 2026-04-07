import React, { useEffect, useState } from 'react';
import { CheckCircle, Search, ShieldCheck, IndianRupee } from 'lucide-react';

const OrderBoard = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState({});
  const [todaysEarnings, setTodaysEarnings] = useState(0);

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        const today = new Date().toISOString().split('T')[0];
        let earnings = 0;
        
        const activeOrders = data
          .filter(o => {
            const isToday = new Date(o.createdAt).toISOString().split('T')[0] === today;
            if (isToday && o.status === 'handover_completed') {
              earnings += o.totalAmount;
            }
            if (o.status !== 'handover_completed') return true;
            return isToday;
          })
          .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));
          
        setOrders(activeOrders);
        setTodaysEarnings(earnings);
      });
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const markPrepared = async (id) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'preparing_completed' })
    });
    fetchOrders();
  };

  const handleVerify = async (order) => {
    const enteredToken = tokens[order.id];
    if (enteredToken && enteredToken.toUpperCase() === order.shortToken) {
      await fetch(`http://localhost:5000/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'handover_completed' })
      });
      setTokens(prev => { const updated = {...prev}; delete updated[order.id]; return updated; });
      fetchOrders();
    } else {
      alert('Invalid unique ID token for this order.');
    }
  };

  const filteredOrders = orders.filter(o => o.studentName?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Order Board</h2>
          <div className="badge badge-completed flex-between" style={{ fontSize: '1.1rem', padding: '0.6rem 1.2rem', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}>
            <IndianRupee size={20} /> Today's Earnings: ₹{todaysEarnings}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search by student name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '250px' }}
          />
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No active orders found.</p>
      ) : (
        <div className="grid-cols-2">
          {filteredOrders.map(order => (
            <div key={order.id} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', opacity: order.status === 'handover_completed' ? 0.6 : 1, borderLeft: `4px solid ${order.status === 'pending' ? 'var(--accent-orange)' : order.status === 'preparing_completed' ? 'var(--accent-blue)' : 'var(--accent-green)'}` }}>
              <div className="flex-between">
                <div>
                  <h3 className="text-gradient" style={{ margin: '0 0 0.5rem 0' }}>#{order.shortToken}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Student: <strong>{order.studentName}</strong></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{order.pickupTime}</span>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.2rem' }}>₹{order.totalAmount}</div>
                </div>
              </div>
              
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0, borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex-between" style={{ padding: '0.25rem 0', color: 'var(--text-secondary)' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              
              <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                {order.status === 'pending' && (
                  <button className="btn-success" style={{ width: '100%' }} onClick={() => markPrepared(order.id)}>
                    <CheckCircle size={18} /> Mark as Prepared
                  </button>
                )}
                {order.status === 'preparing_completed' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Enter Token" 
                      value={tokens[order.id] || ''}
                      onChange={e => setTokens({ ...tokens, [order.id]: e.target.value })}
                      style={{ flex: 1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 'bold' }}
                      maxLength={6}
                    />
                    <button className="btn-primary" onClick={() => handleVerify(order)}>
                      <ShieldCheck size={18} /> Verify
                    </button>
                  </div>
                )}
                {order.status === 'handover_completed' && (
                  <div style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 'bold', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-sm)' }}>
                    <CheckCircle size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Handover Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderBoard;
