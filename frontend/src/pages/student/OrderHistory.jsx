import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock } from 'lucide-react';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/orders/student/${user.id}`)
      .then(res => res.json())
      .then(data => {
        // Sort newest first
        setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
  }, [user.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-pending">Pending</span>;
      case 'preparing_completed': return <span className="badge badge-preparing">Ready for Pickup</span>;
      case 'handover_completed': return <span className="badge badge-completed">Delivered</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>My Orders</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex-between">
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Order placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <h3 style={{ marginTop: '0.25rem' }}>Token: <span className="text-gradient">{order.shortToken}</span></h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '0.5rem' }}>{getStatusBadge(order.status)}</div>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-orange)' }}>
                    <Clock size={16} /> Pickup at {order.pickupTime}
                  </p>
                </div>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />
              
              <div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex-between" style={{ padding: '0.5rem 0' }}>
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex-between" style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
