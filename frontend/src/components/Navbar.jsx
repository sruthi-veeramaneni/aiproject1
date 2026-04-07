import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, LayoutDashboard, Utensils, ClipboardCheck, LogOut, CheckCircle, Wallet, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null; // Don't show navbar on login screen

  return (
    <nav style={{
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container flex-between" style={{ padding: 0 }}>
        <h2 className="text-gradient" style={{ margin: 0 }}>CanteenConnect</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user.role === 'student' ? (
            <>
              <Link to="/student/menu" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <Utensils size={18} /> Menu
              </Link>
              <Link to="/student/orders" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <ClipboardCheck size={18} /> My Orders
              </Link>
              <Link to="/student/cart" className="btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </>
          ) : (
            <>
              <Link to="/owner/orders" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <LayoutDashboard size={18} /> Order Board
              </Link>
              <Link to="/owner/menu" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <Utensils size={18} /> Manage Menu
              </Link>
              <Link to="/owner/verify" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <CheckCircle size={18} /> Verify Target
              </Link>
              <Link to="/owner/payments" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
                <Wallet size={18} /> Payments
              </Link>
            </>
          )}
          
          <button onClick={toggleTheme} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button onClick={handleLogout} className="btn-danger" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
