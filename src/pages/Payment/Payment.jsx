import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import './payment.scss'; 
import { Table, Card, Tag } from 'antd';
import { getAllPayment } from '../../Services/paymentApi';

const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async (pageIndex = 1, pageSize = 10, search = '') => {
    setLoading(true);
    try {
      const data = await getAllPayment(pageIndex, pageSize, search);
      setPaymentData(data.payment); 
      setTotalPayments(data.totalPayment); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(); 
  }, []);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    fetchPayments(current, pageSize); 
  };

  const getStatusTag = (status) => {
    if (status === 'Pending') {
      return <Tag color="yellow">{status}</Tag>; 
    } else if (status === 'Success') { 
      return <Tag color="green">{status}</Tag>; 
    } else if (status === 'Cancel') { 
      return <Tag color="red">{status}</Tag>; 
    } 
    return <Tag>{status}</Tag>;
  };


  const formatPrice = (price) => {
    return `${price.toLocaleString()} VNĐ`;
  };


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
      render: (status) => getStatusTag(status), // Use the status tag here
    },
  ];

  return (
    <div className="payment">
      <Sidebar />
      <div className="paymentContainer">
        <Navbar />
        <div className="paymentContent">
          <Card title="Transaction Management" style={{ margin: 20 }}>
            <Table 
              columns={columns} 
              dataSource={paymentData} 
              pagination={{ total: totalPayments, pageSize: 10 }} 
              loading={loading} 
              rowKey="paymentId" 
              onChange={handleTableChange} 
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
