import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Widget from '../../components/widget/Widget';
import './home.scss';
import { Row, Col, Card, Table, Tag, Statistic } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { getAllAccount, updateAccountAdmin } from '../../Services/userApi';
import { getAllPayment } from '../../Services/paymentApi';
import { getAllSub } from '../../Services/subscriptionApi';
import { ArrowUpOutlined } from '@ant-design/icons';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);

  const formatPrice = (price) => {
    return `${price.toLocaleString()} VNĐ`;
  };

  const getStatusTagSubscription = (status) => {
    if (status === 'Active') {
      return <Tag color="green">{status}</Tag>;
    } else if (status === 'Inactive') {
      return <Tag color="red">{status}</Tag>;
    }
    return <Tag>{status}</Tag>;
  };

  const getStatusTagPayment = (status) => {
    if (status === 'Pending') {
      return <Tag color="yellow">{status}</Tag>; 
    } else if (status === 'Completed') { 
      return <Tag color="green">{status}</Tag>; 
    } else if (status === 'Cancel') { 
      return <Tag color="red">{status}</Tag>; 
    } 
    return <Tag>{status}</Tag>;
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const accountData = await getAllAccount();
      const subData = await getAllSub();
      const paymentData = await getAllPayment();

      setTotalUsers(accountData.totalUser || 0);
      setTotalSubscriptions(subData.totalSubscription || 0);
      setTotalPayments(paymentData.totalPayment || 0);
      setPayments(paymentData.payment || []);
      setSubscriptions(subData.subscription || []);

      // Tính toán doanh thu
      const now = new Date();
      const today = new Date(now.toISOString().split('T')[0]); // Set time to midnight for comparison
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const todayRev = paymentData.payment
        .filter(p => new Date(p.paymentDate).toDateString() === today.toDateString()) // Match exact date
        .reduce((sum, p) => sum + p.amount, 0);

      const weekRev = paymentData.payment
        .filter(p => new Date(p.paymentDate) >= weekAgo && new Date(p.paymentDate) <= now)
        .reduce((sum, p) => sum + p.amount, 0);

      const monthRev = paymentData.payment
        .filter(p => new Date(p.paymentDate) >= monthAgo && new Date(p.paymentDate) <= now)
        .reduce((sum, p) => sum + p.amount, 0);

      setTodayRevenue(todayRev);
      setWeekRevenue(weekRev);
      setMonthRevenue(monthRev);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);


  // Dữ liệu biểu đồ doanh thu
  const revenueData = payments.map(payment => payment.amount);
  const months = payments.map(payment => new Date(payment.paymentDate).toLocaleString('default', { month: 'short' }));

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.2)');
          gradient.addColorStop(1, 'rgba(153, 102, 255, 0.2)');
          return gradient;
        },
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget title="Total Users" value={totalUsers} color="#1890ff" icon="user" textColor="#fff" />
          <Widget title="Total Payments" value={totalPayments} color="#52c41a" icon="shopping-cart" textColor="#fff" />
          <Widget title="Total Subscriptions" value={totalSubscriptions} color="#faad14" icon="dollar" textColor="#fff" />
          <Widget title="Total Revenue" value={formatPrice(revenueData.reduce((a, b) => a + b, 0))} color="#f5222d" icon="wallet" textColor="#fff" />
        </div>
        <div className="charts">
          <Row gutter={16} style={{ height: '100%' }}>
            <Col span={16}>
              <Card title="Revenue Chart" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)', height: '100%' }}>
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                    },
                    animation: { 
                      duration: 2000, 
                      easing: 'easeInOutBounce' 
                    },
                  }} 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Revenue Today"
                      value={todayRevenue}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                      suffix="VNĐ"
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Revenue This Week"
                      value={weekRevenue}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                      suffix="VNĐ"
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card>
                    <Statistic
                      title="Total Revenue This Month"
                      value={monthRevenue}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<ArrowUpOutlined />}
                      suffix="VNĐ"
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card title="Latest Payments" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
                <Table
                  columns={[
                    { title: 'Payment ID', dataIndex: 'paymentId', key: 'paymentId' },
                    { title: 'User Email', dataIndex: 'userEmail', key: 'userEmail' },
                    { 
                      title: 'Amount', 
                      dataIndex: 'amount', 
                      key: 'amount',
                      render: (amount) => formatPrice(amount)
                    },
                    { title: 'Method', dataIndex: 'paymentMethod', key: 'paymentMethod' },
                    { 
                      title: 'Status', 
                      dataIndex: 'status', 
                      key: 'status',
                      render: (status) => getStatusTagPayment(status)
                    },
                  ]}
                  dataSource={payments.slice(0, 5)}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Active Subscriptions" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
                <Table
                  columns={[
                    { title: 'Subscription ID', dataIndex: 'subscriptionId', key: 'subscriptionId' },
                    { title: 'Subscription Name', dataIndex: 'subName', key: 'subName' },
                    { 
                      title: 'Price', 
                      dataIndex: 'price', 
                      key: 'price',
                      render: (price) => formatPrice(price)
                    },
                    { 
                      title: 'Status', 
                      dataIndex: 'status', 
                      key: 'status',
                      render: (status) => getStatusTagSubscription(status)
                    },
                  ]}
                  dataSource={subscriptions.slice(0, 5)}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Home;