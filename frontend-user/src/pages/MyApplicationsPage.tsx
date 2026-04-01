import { useState, useEffect } from 'react';
import { Spin, Empty, Tag, Button, Popconfirm } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, RollbackOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../api/application';
import { useToast } from '../components/Toast';
import type { Application, LearningNeed } from '../types';
import { APPLICATION_STATUS_MAP, LOCATION_TYPE_MAP } from '../types';

const statusColors: Record<string, string> = {
  PENDING: 'processing',
  ACCEPTED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'default',
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [applications, setApplications] = useState<(Application & { need?: LearningNeed })[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  useEffect(() => {
    applicationApi.getMyApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (id: number) => {
    setWithdrawingId(id);
    try {
      await applicationApi.withdraw(id);
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: 'WITHDRAWN' } : app
      ));
      toast.success('申请撤回成功');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '撤回失败');
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: 24 }}>我的申请</h1>
        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
          <Empty description="暂无申请记录" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="page-title" style={{ marginBottom: 24 }}>我的申请</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {applications.map((app) => (
          <div
            key={app.id}
            className="card-interactive"
            onClick={() => app.need && navigate(`/needs/${app.need.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)' }}>
                    {app.need?.title || '需求已删除'}
                  </span>
                  <Tag color={statusColors[app.status]}>
                    {APPLICATION_STATUS_MAP[app.status]}
                  </Tag>
                </div>
                
                {app.need && (
                  <div style={{ display: 'flex', gap: 20, color: 'var(--gray-500)', fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ClockCircleOutlined />
                      {app.need.studyDate} {app.need.startTime}-{app.need.endTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <EnvironmentOutlined />
                      {LOCATION_TYPE_MAP[app.need.locationType]}
                    </span>
                  </div>
                )}
                
                <div style={{ marginTop: 12, padding: 12, background: 'var(--gray-50)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4 }}>我的留言</div>
                  <div style={{ fontSize: 14, color: 'var(--gray-700)' }}>{app.message}</div>
                </div>
              </div>
              
              {app.status === 'PENDING' && (
                <Popconfirm
                  title="确认撤回申请"
                  description="撤回后将取消该申请，确定要继续吗？"
                  okText="确认撤回"
                  cancelText="取消"
                  placement="leftTop"
                  overlayStyle={{
                    minWidth: 280,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  }}
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleWithdraw(app.id);
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<RollbackOutlined />}
                    loading={withdrawingId === app.id}
                    onClick={(e) => e.stopPropagation()}
                    style={{ marginLeft: 12 }}
                  >
                    撤回申请
                  </Button>
                </Popconfirm>
              )}
            </div>
            
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--gray-400)' }}>
              申请时间：{app.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
