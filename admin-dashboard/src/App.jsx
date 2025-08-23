import React from 'react';
import { Layout, Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShopOutlined, GiftOutlined, DollarOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ backgroundColor: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0', color: '#52c41a' }}>
          🍽️ Halal in the City - Admin Dashboard
        </Title>
      </Header>
      
      <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
        <Title level={2}>Dashboard Overview</Title>
        
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={1}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Restaurants"
                value={1}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Deals"
                value={1}
                prefix={<GiftOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Monthly Revenue"
                value={99.99}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Quick Actions" style={{ height: '300px' }}>
              <div style={{ padding: '20px 0' }}>
                <p>• View all restaurants and their subscription status</p>
                <p>• Monitor deal performance and redemptions</p>
                <p>• Manage user accounts and support tickets</p>
                <p>• Generate revenue and analytics reports</p>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="System Status" style={{ height: '300px' }}>
              <div style={{ padding: '20px 0' }}>
                <p>✅ Backend API: Running</p>
                <p>✅ Database: Connected</p>
                <p>✅ Redis Cache: Active</p>
                <p>✅ All systems operational</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
