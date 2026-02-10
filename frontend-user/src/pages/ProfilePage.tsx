import { Avatar, Button, Card, Descriptions } from 'antd';
import { UserOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/Toast';

export default function ProfilePage() {
  const toast = useToast();
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--gray-900)' }}>
        个人中心
      </h1>

      <Card className="card-elevated">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar
            size={96}
            icon={<UserOutlined />}
            src={user?.avatar}
            style={{ background: 'var(--gradient-primary)', marginBottom: 16 }}
          />
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 4 }}>
            {user?.nickname}
          </h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>@{user?.username}</p>
        </div>

        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label={<><UserOutlined /> 用户名</>}>
            {user?.username}
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> 昵称</>}>
            {user?.nickname}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> 邮箱</>}>
            {user?.email}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Button icon={<EditOutlined />} onClick={() => toast.info('编辑功能开发中')}>
            编辑资料
          </Button>
        </div>
      </Card>
    </div>
  );
}
