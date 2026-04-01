import { useState, useEffect } from 'react';
import { Spin, Empty, Tag, Button, Modal, message } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationApi } from '../api/application';
import type { Application, LearningNeed } from '../types';
import { APPLICATION_STATUS_MAP, LOCATION_TYPE_MAP } from '../types';

const statusColors: Record<string, string> = {
  PENDING: 'processing',
  ACCEPTED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
};

export default function MyApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<(Application & { need?: LearningNeed })[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const fetchApplications = () => {
    setLoading(true);
    applicationApi.getMyApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCancelApplication = (id: number) => {
    Modal.confirm({
      title: '确认撤回申请',
      content: '您确定要撤回这个申请吗？撤回后将无法恢复。',
      okText: '确认撤回',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          setCancelingId(id);
          await applicationApi.cancelApplication(id);
          message.success('申请已撤回');
          fetchApplications();
        } catch (error) {
          message.error((error as Error).message || '撤回失败');
        } finally {
          setCancelingId(null);
        }
      },
    });
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
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('button')) {
                app.need && navigate(`/needs/${app.need.id}`);
              }
            }}
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
                <div style={{ marginLeft: 16 }}>
                  <Button
                    danger
                    size="small"
                    loading={cancelingId === app.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelApplication(app.id);
                    }}
                  >
                    撤回申请
                  </Button>
                </div>
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
