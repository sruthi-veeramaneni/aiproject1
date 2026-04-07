import React, { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, Calendar } from 'lucide-react';

const PaymentsList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
  }, []);

  const completedOrders = orders.filter(o => o.status === 'handover_completed');
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  
  const today = new Date().toISOString().split('T')[0];
  const todaysRevenue = completedOrders
    .filter(o => new Date(o.createdAt).toISOString().split('T')[0] === today)
    .reduce((acc, order) => acc + order.totalAmount, 0);

  const todaysOrdersCount = orders.filter(o => new Date(o.createdAt).toISOString().split('T')[0] === today).length;

  return (
    <div className="fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2>Payments & Sales</h2>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))' }}>
          <div style={{ background: 'var(--accent-blue)', padding: '1rem', borderRadius: '50%' }}>
            <IndianRupee size={28} color="white" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</p>
            <h2 style={{ margin: 0, fontSize: '2.5rem' }}>₹{totalRevenue}</h2>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))' }}>
          <div style={{ background: 'var(--accent-green)', padding: '1rem', borderRadius: '50%' }}>
            <TrendingUp size={28} color="white" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Revenue</p>
            <h2 style={{ margin: 0, fontSize: '2.5rem' }}>₹{todaysRevenue}</h2>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'var(--accent-orange)', padding: '1rem', borderRadius: '50%' }}>
            <Calendar size={28} color="white" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Today's Orders</p>
            <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{todaysOrdersCount}</h2>
          </div>
        </div>
      </div>

      <h3>Transaction History</h3>
      <div className="glass-panel" style={{ marginTop: '1rem', padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Order Token</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Student Name</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Date & Time</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No payments found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'var(--transition)' }} className="table-row-hover">
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>#{order.shortToken}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{order.studentName}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${order.status === 'pending' ? 'badge-pending' : order.status === 'preparing_completed' ? 'badge-preparing' : 'badge-completed'}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                    ₹{order.totalAmount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsList;
