import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Dropdown, Button, Menu, Input } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './payment.scss';
import { getAllPaymentOrderDate } from '../../Services/paymentApi';

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');

  // Hàm kết hợp cả status và searchText vào một chuỗi duy nhất
  const combinedSearch = `${statusFilter} ${searchText}`.trim();

  // Hàm fetch dữ liệu từ API với các tham số lọc
  const fetchPayments = async (pageIndex = 1, pageSize = 10, search = '') => {
    setLoading(true);
    console.log(`Fetching payments with combined search: ${search}, pageIndex: ${pageIndex}, pageSize: ${pageSize}`); // Log tham số

    try {
      const data = await getAllPaymentOrderDate(pageIndex, pageSize, search);
      console.log("API response data:", data); // Log dữ liệu từ API

      setPaymentData(data.payment);
      setTotalPayments(data.totalPayment);
    } catch (error) {
      console.error("Error fetching payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1, 10, combinedSearch); // Lấy dữ liệu với bộ lọc kết hợp khi component mount
  }, [combinedSearch]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchPayments(current, pageSize, combinedSearch);
  };

  const getStatusTag = (status) => {
    const color = status === 'PAID' ? 'green' : status === 'Pending' ? 'yellow' : 'red';
    return <Tag color={color}>{status}</Tag>;
  };

  const formatPrice = (price) => `${price.toLocaleString()} VNĐ`;

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status); // Cập nhật bộ lọc trạng thái
  };

  const handleSearch = (value) => {
    setSearchText(value); // Cập nhật giá trị tìm kiếm
  };

  const statusMenu = (
    <Menu onClick={(e) => handleStatusFilterChange(e.key)}>
      <Menu.Item key="">All</Menu.Item>
      <Menu.Item key="PAID">PAID</Menu.Item>
      <Menu.Item key="Pending">Pending</Menu.Item>
      <Menu.Item key="CANCELLED">CANCELLED</Menu.Item>
      
    </Menu>
  );

  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'User Email',
      dataIndex: 'userEmail',
      key: 'userEmail',
    },
    {
      title: 'Subscription Name',
      dataIndex: 'subscriptionName',
      key: 'subscriptionName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => formatPrice(text),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <div className="payment">
      <Sidebar />
      <div className="paymentContainer">
        <Navbar />
        <div className="paymentContent">
          <Card
            title="Transaction Management"
            style={{ margin: 20 }}
            extra={
              <div style={{ display: 'flex', gap: '10px' }}>
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Dropdown overlay={statusMenu} trigger={['click']}>
                  <Button>
                    Filter by Status <DownOutlined />
                  </Button>
                </Dropdown>
              </div>
            }
          >
            <Table
              columns={columns}
              dataSource={paymentData}
              pagination={{ total: totalPayments, pageSize: 10 }}
              loading={loading}
              rowKey="transactionId"
              onChange={handleTableChange}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
