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
import { ArrowUpOutlined } from '@ant-design/icons';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersToday, setTotalUsersToday] = useState(0);
  const [totalUsersThisWeek, setTotalUsersThisWeek] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [payments, setPayments] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);

  const formatPrice = (price) => {
    return `${price.toLocaleString()} VNĐ`;
  };

  const getStatusTagPayment = (status) => {
    if (status === 'Pending') {
      return <Tag color="yellow">{status}</Tag>; 
    } else if (status === 'PAID') { 
      return <Tag color="green">{status}</Tag>; 
    } else if (status === 'CANCELLED') { 
      return <Tag color="red">{status}</Tag>; 
    } 
    return <Tag>{status}</Tag>;
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const accountData = await getAllAccount();
      const paymentData = await getAllPayment();

      setTotalUsers(accountData.totalUser || 0);
      setTotalPayments(paymentData.totalPayment || 0);
      setPayments(paymentData.payment || []);

      const now = new Date();
      const today = new Date(now.toISOString().split('T')[0]); 
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Calculate users today and this week
      const todayUsers = accountData.users.filter(
        user => new Date(user.createdAt).toDateString() === today.toDateString()
      ).length;

      const weekUsers = accountData.users.filter(
        user => new Date(user.createdAt) >= weekAgo && new Date(user.createdAt) <= now
      ).length;

      setTotalUsersToday(todayUsers);
      setTotalUsersThisWeek(weekUsers);

      // Filter only "Success" payments
      const successPayments = paymentData.payment.filter(p => p.status === 'PAID');
      console.log("Payment statuses:", payments.map(p => p.status));


      // Calculate revenue for "Success" payments
      const todayRev = successPayments
        .filter(p => new Date(p.paymentDate).toDateString() === today.toDateString())
        .reduce((sum, p) => sum + p.amount, 0);

      const weekRev = successPayments
        .filter(p => new Date(p.paymentDate) >= weekAgo && new Date(p.paymentDate) <= now)
        .reduce((sum, p) => sum + p.amount, 0);

      const monthRev = successPayments
        .filter(p => new Date(p.paymentDate) >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()) && new Date(p.paymentDate) <= now)
        .reduce((sum, p) => sum + p.amount, 0);

      setTodayRevenue(todayRev);
      setWeekRevenue(weekRev);
      setMonthRevenue(monthRev);

      // Set payments to only successful ones for chart and widget
      setPayments(successPayments);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);

// Dữ liệu biểu đồ doanh thu chỉ lấy "Success" payments
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

// Update the widget that displays total revenue
const totalRevenue = formatPrice(revenueData.reduce((a, b) => a + b, 0));

return (
  <div className="home">
    <Sidebar />
    <div className="homeContainer">
      <Navbar />
      <div className="widgets">
        <Widget title="Total Users" value={totalUsers} color="#1890ff" icon="user" textColor="#fff" />
        <Widget title="Total Payments" value={totalPayments} color="#52c41a" icon="shopping-cart" textColor="#fff" />
        <Widget title="Total Users Today" value={totalUsersToday} color="#faad14" icon="user-add" textColor="#fff" />
        <Widget title="Total Users This Week" value={totalUsersThisWeek} color="#13c2c2" icon="usergroup-add" textColor="#fff" />
        <Widget title="Total Revenue" value={totalRevenue} color="#f5222d" icon="wallet" textColor="#fff" />
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
                      labels: {
                        color: '#333', // Màu chữ cho legend
                      },
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
      </div>
    </div>
  </div>
);


};

export default Home;
