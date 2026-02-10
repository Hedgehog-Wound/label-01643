import { useState } from 'react';
import { Form, Input, Button, Tabs } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/Toast';

export default function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const { login, register, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');

  const onLogin = async (values: { username: string; password: string }) => {
    try {
      await login(values.username, values.password);
      toast.success('登录成功');
      navigate('/needs');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '登录失败');
    }
  };

  const onRegister = async (values: { username: string; password: string; nickname: string }) => {
    try {
      await register(values.username, values.password, values.nickname);
      toast.success('注册成功，请登录');
      setActiveTab('login');
    } catch {
      toast.error('注册失败');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decoration */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60%',
          height: '60%',
          background: 'var(--gradient-hero)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.2,
        }}
      />

      {/* Login Card */}
      <div
        className="card-glass animate-fade-in-up"
        style={{
          width: 440,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-xl)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
            }}
          >
            📚
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}
          >
            StudyBuddy
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 15 }}>
            找到志同道合的学习伙伴
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form onFinish={onLogin} layout="vertical" style={{ marginTop: 8 }}>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: 'var(--gray-400)' }} />}
                      placeholder="用户名"
                      size="large"
                      style={{ height: 48 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'var(--gray-400)' }} />}
                      placeholder="密码"
                      size="large"
                      style={{ height: 48 }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                      style={{ height: 48, fontSize: 16 }}
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form onFinish={onRegister} layout="vertical" style={{ marginTop: 8 }}>
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: '请输入用户名' },
                      { min: 3, max: 20, message: '用户名长度3-20位' },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: 'var(--gray-400)' }} />}
                      placeholder="用户名"
                      size="large"
                      style={{ height: 48 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="nickname"
                    rules={[{ required: true, message: '请输入昵称' }]}
                  >
                    <Input
                      prefix={<SmileOutlined style={{ color: 'var(--gray-400)' }} />}
                      placeholder="昵称"
                      size="large"
                      style={{ height: 48 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, max: 20, message: '密码长度6-20位' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: 'var(--gray-400)' }} />}
                      placeholder="密码"
                      size="large"
                      style={{ height: 48 }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      loading={loading}
                      style={{ height: 48, fontSize: 16 }}
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 8 }}>
            加入 StudyBuddy，开启高效学习之旅
          </p>
          <p style={{ color: 'var(--gray-500)', fontSize: 12, background: 'var(--gray-100)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
            测试账号：zhangsan / lisi / wangwu，密码：admin123
          </p>
        </div>
      </div>
    </div>
  );
}
