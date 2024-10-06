import React from 'react';
import './widget.scss';
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, WalletOutlined } from '@ant-design/icons';

// Định nghĩa các biểu tượng cho từng loại widget
const iconMap = {
  user: <UserOutlined style={{ fontSize: 24, color: '#fff' }} />,
  'shopping-cart': <ShoppingCartOutlined style={{ fontSize: 24, color: '#fff' }} />,
  dollar: <DollarCircleOutlined style={{ fontSize: 24, color: '#fff' }} />,
  wallet: <WalletOutlined style={{ fontSize: 24, color: '#fff' }} />,
};

const Widget = ({ title, value, color, boxShadow, icon }) => {
  return (
    <div className="widget" style={{ backgroundColor: color || '#fff', boxShadow: boxShadow || '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div className="left">
        <span className="title">{title}</span>
        <span className="counter">{value}</span>
      </div>
      <div className="right">
        <div className="iconContainer">
          {iconMap[icon] || iconMap['user']}
        </div>
      </div>
    </div>
  );
};

export default Widget;
