import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Widget from '../../components/widget/Widget';
import './home.scss';
import { Row, Col, Card, Table } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần biểu đồ cần thiết
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const Home = () => {
  // Dữ liệu biểu đồ
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 2000, 1500, 4000, 3000, 4500, 5000, 3500, 3000, 4000, 4500, 5000],
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }

          // Sử dụng gradient màu cho nền của biểu đồ
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

  // Dữ liệu bảng giao dịch
  const transactions = [
    { key: 1, id: '1143155', product: 'Acer Nitro 5', customer: 'John Smith', date: '1 March', amount: '$785', method: 'Cash on Delivery', status: 'Approved' },
    { key: 2, id: '1143156', product: 'Dell Inspiron', customer: 'Sara Smith', date: '2 March', amount: '$900', method: 'Online Payment', status: 'Pending' },
    { key: 3, id: '1143157', product: 'MacBook Pro', customer: 'Anna Lee', date: '3 March', amount: '$1200', method: 'Credit Card', status: 'Approved' },
    { key: 4, id: '1143158', product: 'HP Spectre', customer: 'James Brown', date: '4 March', amount: '$1000', method: 'Cash on Delivery', status: 'Approved' },
    { key: 5, id: '1143159', product: 'Lenovo ThinkPad', customer: 'Emily Davis', date: '5 March', amount: '$950', method: 'Online Payment', status: 'Pending' },
  ];

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget title="USERS" value="100" color="#f0f2f5" icon="user" />
          <Widget title="ORDERS" value="200" color="#f0f2f5" icon="shopping-cart" />
          <Widget title="EARNINGS" value="$3000" color="#f0f2f5" icon="dollar" />
          <Widget title="BALANCE" value="$4000" color="#f0f2f5" icon="wallet" />
        </div>
        <div className="charts">
          <Row gutter={16} style={{ height: '100%' }}>
            <Col span={8}>
              <Card title="Total Revenue" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)', height: '100%' }}>
                <h3>Total Revenue Today: $500</h3>
                <h3>Total Revenue This Week: $3000</h3>
                <h3>Total Revenue This Month: $12000</h3>
              </Card>
            </Col>
            <Col span={16}>
              <Card title="Revenue Chart" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)', height: '100%' }}>
                <Line 
                  data={data} 
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
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col span={24}>
              <Card title="Last Transactions" style={{ borderRadius: 15, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
                <Table
                  columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Product', dataIndex: 'product', key: 'product' },
                    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
                    { title: 'Date', dataIndex: 'date', key: 'date' },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
                    { title: 'Method', dataIndex: 'method', key: 'method' },
                    { title: 'Status', dataIndex: 'status', key: 'status' },
                  ]}
                  dataSource={transactions}
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
