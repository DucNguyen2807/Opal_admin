import React from 'react';
import './sidebar.scss';
import { Link } from 'react-router-dom';
import { DashboardOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Opal Admin</span>
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
            <Link to="/payments">Payment</Link>
          </li>
          <li>
            <DollarOutlined className="icon" />
            <Link to="/subscriptions">Subscription</Link>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingOutlined className="icon" />
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div>
    </div>
  );
};

export default Sidebar;
