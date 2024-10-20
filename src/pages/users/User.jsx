import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Tag } from 'antd'; // Import Tag
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './user.scss'; 
import { Table, Card, Button } from 'antd';
import { getAllAccount, updateAccountAdmin } from '../../Services/userApi'; // Import updateAccountAdmin
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import icons

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to store the selected user for editing
  const [form] = Form.useForm(); // Create form from Ant Design

  // Fetch the list of users
  const fetchUsers = async (pageIndex = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const data = await getAllAccount(pageIndex, pageSize, search);
      setUserData(data.users);
      setTotalUsers(data.totalUser);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  // Handle pagination changes
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchUsers(current, pageSize);
  };

  // Open modal for editing user
  const handleEdit = (user) => {
    if (user && user.userId) {
      setSelectedUser(user);
      form.setFieldsValue({
        fullname: user.fullname,
        phoneNumber: user.phoneNumber,
      });
      setIsModalVisible(true); // Show edit modal
    } else {
      message.error('Invalid user selected');
    }
  };

  // Get the role tag based on user role
  const getRoleUser = (role) => {
    if (role === 'User') {
      return <Tag color="yellow">{role}</Tag>; // Use correct role variable
    } else if (role === 'Admin') {
      return <Tag color="green">{role}</Tag>;
    }
    return <Tag>{role}</Tag>;
  };

  // Update user information
  const handleUpdate = async () => {
    try {
      if (!selectedUser || !selectedUser.userId) {
        message.error('User ID is undefined, cannot update');
        return;
      }

      const values = form.getFieldsValue();
      await updateAccountAdmin(selectedUser.userId, values.fullname, values.phoneNumber);
      message.success('User updated successfully');
      setIsModalVisible(false); // Close modal after update
      form.resetFields(); // Reset form fields
      fetchUsers(); // Refresh user list after update
    } catch (error) {
      message.error('Failed to update user');
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Name',
      dataIndex: 'fullname',
      key: 'fullname',
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
      render: (role) => getRoleUser(role),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="default" 
            size="small" 
            style={{ marginRight: '10px', backgroundColor: '#1890ff', borderColor: '#1890ff' }} 
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />} // Icon for edit
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            size="small" 
            style={{ marginRight: '10px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} 
            onClick={() => handleDelete(record.userId)} // Add a handleDelete function
            icon={<DeleteOutlined />} // Icon for delete
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="users" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="usersContainer">
        <Navbar />
        <div className="userContent">
          <Card title="User Management" style={{ margin: 20, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <Table 
              columns={columns} 
              dataSource={userData} 
              pagination={{ total: totalUsers, pageSize: 10 }} 
              loading={loading} 
              rowKey="userId" 
              onChange={handleTableChange} 
              style={{ borderRadius: '10px' }}
            />
          </Card>
        </div>
      </div>
      {/* Modal for updating user information */}
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields(); // Reset fields on cancel
        }}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: 'Please enter the full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: 'Please enter the phone number' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
