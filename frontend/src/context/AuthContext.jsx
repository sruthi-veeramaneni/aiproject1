import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('canteen_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, expectedRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        if (expectedRole && data.user.role !== expectedRole) {
          return { success: false, message: `Access denied. Please use the ${data.user.role} portal.` };
        }
        setUser(data.user);
        localStorage.setItem('canteen_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('canteen_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("Registration failed:", error);
      return { success: false, message: "Server connection failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('canteen_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
