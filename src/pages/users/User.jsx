import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './user.scss';
import { Table, Card, Button } from 'antd';

const Users = () => {
  // Dữ liệu mẫu người dùng
  const userData = [
    {
      key: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Editor',
      status: 'Inactive',
    },
  ];

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span style={{ color: text === 'Active' ? 'green' : 'red' }}>{text}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button type="primary" size="small" style={{ marginRight: '10px' }}>
            View
          </Button>
          <Button type="default" size="small" style={{ marginRight: '10px' }}>
            Edit
          </Button>
          <Button type="danger" size="small">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="users">
      <Sidebar />
      <div className="usersContainer">
        <Navbar />
        <div className="userContent">
          <Card title="User Management" style={{ margin: 20 }}>
            <Table columns={columns} dataSource={userData} pagination={false} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Users;
