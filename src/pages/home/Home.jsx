import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Widget from '../../components/widget/Widget';
import './home.scss';
import { Row, Col, Card, Statistic, DatePicker, Radio } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { getAllAccount } from '../../Services/userApi';
import { getAllPayment } from '../../Services/paymentApi';
import { ArrowUpOutlined } from '@ant-design/icons';
import moment from 'moment';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUsersToday, setTotalUsersToday] = useState(0);
  const [totalUsersThisWeek, setTotalUsersThisWeek] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [timeFilter, setTimeFilter] = useState('day');

  const formatPrice = (price) => `${price.toLocaleString()} VNĐ`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountData = await getAllAccount();
        const paymentData = await getAllPayment();
        const paidPayments = paymentData.payment.filter(p => p.status === 'PAID');

        const updatedPayments = paidPayments.map(payment => ({
          ...payment,
          paymentDate: moment(payment.paymentDateFormatted).format('YYYY-MM-DD'),
        }));

        setTotalUsers(accountData.totalUser || 0);
        setPayments(updatedPayments);
        setFilteredPayments(updatedPayments);

        const now = moment();
        const today = now.startOf('day');
        const weekAgo = moment().subtract(7, 'days').startOf('day');

        setTotalPayments(updatedPayments.length);

        const todayUsers = accountData.users.filter(
          user => moment(user.createdAt).isSame(today, 'day')
        ).length;

        const weekUsers = accountData.users.filter(
          user => moment(user.createdAt).isBetween(weekAgo, now, 'day', '[]')
        ).length;

        setTotalUsersToday(todayUsers);
        setTotalUsersThisWeek(weekUsers);

        const todayRev = updatedPayments
          .filter(p => moment(p.paymentDate).isSame(today, 'day'))
          .reduce((sum, p) => sum + p.amount, 0);

        const weekRev = updatedPayments
          .filter(p => moment(p.paymentDate).isBetween(weekAgo, now, 'day', '[]'))
          .reduce((sum, p) => sum + p.amount, 0);

        const monthRev = updatedPayments
          .filter(p => moment(p.paymentDate).isSame(now, 'month'))
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

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setTimeFilter(value);
    
    const now = moment();
    let filteredData = [];
    
    switch(value) {
      case 'day':
        filteredData = payments.filter(payment => 
          moment(payment.paymentDate).isSame(now, 'day')
        );
        break;
      case 'week':
        filteredData = payments.filter(payment => 
          moment(payment.paymentDate).isBetween(
            moment().subtract(7, 'days').startOf('day'),
            moment().endOf('day'),
            'day',
            '[]'
          )
        );
        break;
      case 'month':
        filteredData = payments.filter(payment => 
          moment(payment.paymentDate).isBetween(
            moment().subtract(30, 'days').startOf('day'),
            moment().endOf('day'),
            'day',
            '[]'
          )
        );
        break;
      default:
        filteredData = payments;
    }
    
    setFilteredPayments(filteredData);
  };

  const handleDateChange = (dates) => {
    if (!dates || dates.length === 0) return;
    
    // Chuyển đổi dates thành moment và set giờ
    const start = moment(dates[0].format('YYYY-MM-DD')).startOf('day');
    const end = moment(dates[1].format('YYYY-MM-DD')).endOf('day');

    console.log('Start Date:', start.format('YYYY-MM-DD HH:mm:ss'));
    console.log('End Date:', end.format('YYYY-MM-DD HH:mm:ss'));

    const filtered = payments.filter((payment) => {
        // Chuyển đổi payment date thành moment
        const paymentDate = moment(payment.paymentDateFormatted).startOf('day');
        
        // So sánh ngày
        const isBetween = paymentDate.isBetween(start, end, 'day', '[]');
        
        console.log('Payment Date:', paymentDate.format('YYYY-MM-DD'), 'Is Between:', isBetween);
        
        return isBetween;
    });

    console.log('Filtered Payments:', filtered);
    setFilteredPayments(filtered);

    // Cập nhật dữ liệu biểu đồ
    const revenueData = filtered.map(payment => payment.amount);
    const months = filtered.map(payment => 
        moment(payment.paymentDateFormatted).format('MMM DD')
    );

    console.log('Revenue Data:', revenueData);
    console.log('Months:', months);
};

  const chartData = {
    labels: filteredPayments.map(payment => moment(payment.paymentDate).format('MMM DD')),
    datasets: [{
      label: 'Revenue',
      data: filteredPayments.map(payment => payment.amount),
      fill: true,
      backgroundColor: (context) => {
        const { ctx, chartArea } = context.chart;
        if (!chartArea) return;
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
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#333' },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value);
          }
        }
      }
    },
    animation: { 
      duration: 2000, 
      easing: 'easeInOutBounce' 
    },
  };

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
          <Widget 
            title="Total Revenue" 
            value={formatPrice(filteredPayments.reduce((a, b) => a + b.amount, 0))} 
            color="#f5222d" 
            icon="wallet" 
            textColor="#fff" 
          />
        </div>
        <div className="charts">
          <Row gutter={16} style={{ height: '100%' }}>
            <Col xs={24} xl={16}>
              <Card 
                title="Revenue Chart" 
                extra={
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Radio.Group 
                      value={timeFilter} 
                      onChange={handleFilterChange}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="day">Day</Radio.Button>
                      <Radio.Button value="week">Week</Radio.Button>
                      <Radio.Button value="month">Month</Radio.Button>
                    </Radio.Group>
                    <RangePicker onChange={handleDateChange} />
                  </div>
                }
                style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)', height: '100%' }}
              >
                <Line data={chartData} options={chartOptions} />
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Row gutter={[0, 16]}>
                {[
                  { title: "Today", value: todayRevenue },
                  { title: "This Week", value: weekRevenue },
                  { title: "This Month", value: monthRevenue }
                ].map((item, index) => (
                  <Col span={24} key={index}>
                    <Card>
                      <Statistic
                        title={`Total Revenue ${item.title}`}
                        value={item.value}
                        precision={0}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="VNĐ"
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Home;