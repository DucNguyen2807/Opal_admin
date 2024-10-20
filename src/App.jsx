import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Users from './pages/users/User';
import Subscription from './pages/subscription/Subscription';
import Payment from './pages/Payment/Payment';
import Login from './pages/login/Login'; 
import PaymentSuccess from './pages/paymentSucess/index';
import './App.css';

const App = () => {
  const isAdmin = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token && role === 'Admin';
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
        <Route path="/tien" element={<PaymentSuccess />} />


          {isAdmin() ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<Users />} />
              <Route path="/subscriptions" element={<Subscription />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
