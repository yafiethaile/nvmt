import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory'; 
import Suppliers from './components/Suppliers'; 
import OrdersAndPurchases from './components/OrdersAndPurchases'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} /> // Newly added
        <Route path="/suppliers" element={<Suppliers />} /> // Newly added
        <Route path="/orders" element={<OrdersAndPurchases />} /> // Newly added
      </Routes>
    </Router>
  );
}

export default App;
