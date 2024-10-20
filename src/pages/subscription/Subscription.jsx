import React, { useEffect, useState } from 'react';
import { Tag, Modal, Form, Input, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Thêm icons
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './subscription.scss';
import { Table, Card } from 'antd';
import { getAllSub, toggleSubscriptionStatus, updateSubscription } from '../../Services/subscriptionApi';

const Subscription = () => {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [form] = Form.useForm();

  // Lấy dữ liệu từ API
  const fetchSubscriptions = async (pageIndex = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const data = await getAllSub(pageIndex, pageSize, search);
      setSubscriptionData(data.subscription);
      setTotalSubscriptions(data.totalSubscription);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(); 
  }, []);

  // Xử lý phân trang
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchSubscriptions(current, pageSize);
  };

  // Thay đổi trạng thái của Subscription
  const handleToggleStatus = async (subscriptionId) => {
    try {
      await toggleSubscriptionStatus(subscriptionId);
      fetchSubscriptions();
    } catch (error) {
      console.error('Failed to toggle subscription status:', error);
    }
  };

  // Hiển thị modal chỉnh sửa
  const handleEditClick = (subscription) => {
    setCurrentSubscription(subscription);
    form.setFieldsValue(subscription);
    setVisible(true);
  };

  // Xử lý khi submit form cập nhật
  const handleUpdateSubmit = async (values) => {
    try {
      const updatedValues = {
        ...values,
        price: parseFloat(values.price),
      };
      await updateSubscription(currentSubscription.subscriptionId, updatedValues);
      fetchSubscriptions();
      setVisible(false);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  // Định dạng trạng thái thành các thẻ màu
  const getStatusTag = (status) => {
    const trimmedStatus = status.trim(); 
    if (trimmedStatus === 'Active') {
      return <Tag color="green">{trimmedStatus}</Tag>;
    } else if (trimmedStatus === 'Not Active') {
      return <Tag color="red">{trimmedStatus}</Tag>;
    }
    return <Tag>{trimmedStatus}</Tag>;
  };

  // Định dạng giá tiền
  const formatPrice = (price) => {
    return `${price.toLocaleString()} VNĐ`;
  };

  // Các cột trong bảng
  const columns = [
    {
      title: 'Subscription Name',
      dataIndex: 'subName',
      key: 'subName',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => `${text} ngày`, 
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Description',
      dataIndex: 'subDescription',
      key: 'subDescription',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
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
            onClick={() => handleEditClick(record)}
            icon={<EditOutlined />} // Thêm icon cho nút chỉnh sửa
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            size="small" 
            style={{ marginRight: '10px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} 
            onClick={() => handleToggleStatus(record.subscriptionId)}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="subscription">
      <Sidebar />
      <div className="subscriptionContainer">
        <Navbar />
        <div className="subscriptionContent">
          <Card title="Subscription Management" style={{ margin: 20, backgroundColor: '#f0f2f5', borderRadius: '10px' }}>
            <Table 
              columns={columns} 
              dataSource={subscriptionData} 
              pagination={{ total: totalSubscriptions, pageSize: 10 }} 
              loading={loading} 
              rowKey="subscriptionId" 
              onChange={handleTableChange} 
              style={{ borderRadius: '10px' }}
            />
          </Card>
          <Modal
            title="Update Subscription"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            destroyOnClose={true}
            bodyStyle={{ borderRadius: '10px' }} // Thêm border-radius cho modal
          >
            <Form 
              form={form} 
              onFinish={handleUpdateSubmit}
              layout="vertical"
            >
              <Form.Item
                name="subName"
                label="Subscription Name"
                rules={[{ required: true, message: 'Please input Subscription Name' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="duration"
                label="Duration (days)"
                rules={[{ required: true, type: 'number', min: 1, max: 365, message: 'Duration must be between 1 and 365 days.' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input a price.' }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="subDescription"
                label="Description"
                rules={[{ required: true, message: 'Please input Subscription Description' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Update
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
