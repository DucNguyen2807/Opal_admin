import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Users from './pages/users/User';
import Subscription from './pages/subscription/Subscription';
import Payment from './pages/Payment/Payment';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/payments" element={<Payment />} />
      </Routes>
    </Router>
  );
};

export default App;
