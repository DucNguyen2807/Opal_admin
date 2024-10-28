import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Tag, Dropdown, Menu } from 'antd';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './user.scss'; 
import { Table, Card, Button } from 'antd';
import { getAllAccount, updateAccountAdmin } from '../../Services/userApi';
import { EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';

const { Search } = Input;

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState(''); // State for subscription filter
  const [form] = Form.useForm();

  const combinedSearchQuery = `${subscriptionFilter} ${searchQuery}`.trim();

  // Fetch users
  const fetchUsers = async (pageIndex = 1, pageSize = 10, search = combinedSearchQuery) => {
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
    fetchUsers(); 
  }, [combinedSearchQuery]); // Trigger fetch on combinedSearchQuery change

  // Handle table pagination and sorting
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchUsers(current, pageSize);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle subscription filter change
  const handleSubscriptionFilterChange = (subscription) => {
    setSubscriptionFilter(subscription === 'All' ? '' : subscription);
  };

  // Open edit modal
  const handleEdit = (user) => {
    if (user && user.userId) {
      setSelectedUser(user);
      form.setFieldsValue({
        fullname: user.fullname,
        phoneNumber: user.phoneNumber,
      });
      setIsModalVisible(true);
    } else {
      message.error('Invalid user selected');
    }
  };

  // Get user role tag
  const getRoleUser = (role) => {
    if (role === 'User') {
      return <Tag color="yellow">{role}</Tag>;
    } else if (role === 'Admin') {
      return <Tag color="green">{role}</Tag>;
    }
    return <Tag>{role}</Tag>;
  };

  // Update user info
  const handleUpdate = async () => {
    try {
      if (!selectedUser || !selectedUser.userId) {
        message.error('User ID is undefined, cannot update');
        return;
      }

      const values = form.getFieldsValue();
      await updateAccountAdmin(selectedUser.userId, values.fullname, values.phoneNumber);
      message.success('User updated successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers(); 
    } catch (error) {
      message.error('Failed to update user');
      console.error(error);
    }
  };

  const subscriptionMenu = (
    <Menu onClick={(e) => handleSubscriptionFilterChange(e.key)}>
      <Menu.Item key="">All</Menu.Item>
      <Menu.Item key="Premium">Premium</Menu.Item>
      <Menu.Item key="Free">Free</Menu.Item>
    </Menu>
  );

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
      title: 'Subscription',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
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
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            size="small" 
            style={{ marginRight: '10px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} 
            onClick={() => handleDelete(record.userId)}
            icon={<DeleteOutlined />}
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <Search
                placeholder="Search users"
                enterButton
                onSearch={handleSearch}
                style={{ maxWidth: '300px' }}
              />
              <Dropdown overlay={subscriptionMenu} trigger={['click']}>
                <Button>
                  Filter by Subscription <DownOutlined />
                </Button>
              </Dropdown>
            </div>
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
      <Modal
        title="Edit User"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
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
