import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Session Expired</h2>
        <button className="btn-primary" onClick={() => navigate('/student/menu')}>Back to Menu</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
        <CheckCircle size={64} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
        <h2 className="text-gradient">Payment Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your order has been confirmed and is sent to the canteen.</p>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          <p style={{ textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--text-secondary)' }}>Your Unique Handover ID</p>
          <h1 style={{ fontSize: '4rem', letterSpacing: '8px', color: 'var(--accent-purple)', margin: '1rem 0' }}>{order.shortToken}</h1>
          <p style={{ color: 'var(--accent-orange)' }}>Show this token at the counter at <b>{order.pickupTime}</b></p>
        </div>

        <button className="btn-primary" onClick={() => navigate('/student/orders')}>
          View My Orders <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
