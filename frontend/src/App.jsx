import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import MenuPage from './pages/student/MenuPage';
import CartPage from './pages/student/CartPage';
import OrderConfirmation from './pages/student/OrderConfirmation';
import OrderHistory from './pages/student/OrderHistory';
import OrderBoard from './pages/owner/OrderBoard';
import MenuManagement from './pages/owner/MenuManagement';
import VerifyHandover from './pages/owner/VerifyHandover';
import PaymentsList from './pages/owner/PaymentsList';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'student' ? '/student/menu' : '/owner/orders'} /> : <Home />} />
          
          {/* Student Routes */}
          <Route path="/student/menu" element={<ProtectedRoute allowedRole="student"><MenuPage /></ProtectedRoute>} />
          <Route path="/student/cart" element={<ProtectedRoute allowedRole="student"><CartPage /></ProtectedRoute>} />
          <Route path="/student/confirmation" element={<ProtectedRoute allowedRole="student"><OrderConfirmation /></ProtectedRoute>} />
          <Route path="/student/orders" element={<ProtectedRoute allowedRole="student"><OrderHistory /></ProtectedRoute>} />

          {/* Owner Routes */}
          <Route path="/owner/orders" element={<ProtectedRoute allowedRole="owner"><OrderBoard /></ProtectedRoute>} />
          <Route path="/owner/menu" element={<ProtectedRoute allowedRole="owner"><MenuManagement /></ProtectedRoute>} />
          <Route path="/owner/verify" element={<ProtectedRoute allowedRole="owner"><VerifyHandover /></ProtectedRoute>} />
          <Route path="/owner/payments" element={<ProtectedRoute allowedRole="owner"><PaymentsList /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
