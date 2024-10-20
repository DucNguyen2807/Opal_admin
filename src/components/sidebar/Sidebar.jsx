import React from 'react';
import './sidebar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, LogoutOutlined } from '@ant-design/icons'; 
import logo from '../../assets/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';

  };

  return (
    <div className="sidebar">
      <div className="top">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardOutlined className="icon" />
            <Link to="/">Dashboard</Link>
          </li>
          <p className="title">LISTS</p>
          <li>
            <UserOutlined className="icon" />
            <Link to="/users">Users</Link>
          </li>
          <li>
            <ShoppingCartOutlined className="icon" />
            <Link to="/payments">Transaction</Link>
          </li>
          <li>
            <DollarOutlined className="icon" />
            <Link to="/subscriptions">Subscription</Link>
          </li>
        </ul>
        <div className="logout">
        <LogoutOutlined className="icon" onClick={handleLogout} />
        <span onClick={handleLogout} style={{ cursor: 'pointer', marginLeft: '8px' }}>Logout</span>
      </div>
      </div>
      
    </div>
  );
};

export default Sidebar;
