import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, Button, Space, Spin, Modal, Input, List, Popconfirm } from 'antd';
import {
  ClockCircleOutlined, EnvironmentOutlined, UserOutlined, TeamOutlined,
  EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, ArrowLeftOutlined,
} from '@ant-design/icons';
import { needApi } from '../api/need';
import { applicationApi } from '../api/application';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/Toast';
import type { LearningNeed, Application } from '../types';
import { STUDY_TYPE_MAP, LOCATION_TYPE_MAP, NEED_STATUS_MAP, APPLICATION_STATUS_MAP } from '../types';

const statusConfig: Record<string, { color: string; bg: string }> = {
  OPEN: { color: '#16a34a', bg: '#f0fdf4' },
  MATCHED: { color: '#2563eb', bg: '#eff6ff' },
  COMPLETED: { color: '#71717a', bg: '#f4f4f5' },
  CANCELLED: { color: '#dc2626', bg: '#fef2f2' },
};

const typeConfig: Record<string, { color: string; bg: string; icon: string }> = {
  EXAM_REVIEW: { color: '#dc2626', bg: '#fef2f2', icon: '📝' },
  HOMEWORK: { color: '#2563eb', bg: '#eff6ff', icon: '📖' },
  PROJECT: { color: '#16a34a', bg: '#f0fdf4', icon: '🚀' },
  SELF_STUDY: { color: '#7c3aed', bg: '#f5f3ff', icon: '💡' },
  COMPETITION: { color: '#d97706', bg: '#fffbeb', icon: '🏆' },
};

export default function NeedDetailPage() {
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [need, setNeed] = useState<LearningNeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [myApplication, setMyApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applyModal, setApplyModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const isOwner = need?.userId === user?.id;

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await needApi.getById(Number(id));
      setNeed(result.need);
      setHasApplied(result.hasApplied);
      setMyApplication(result.myApplication);
      // 只有发布者才能查看申请记录
      if (result.need.userId === user?.id) {
        const apps = await applicationApi.getByNeedId(Number(id));
        setApplications(apps);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleApply = async () => {
    if (!applyMessage.trim()) {
      setApplyError('请填写申请留言');
      return;
    }
    setApplyLoading(true);
    setApplyError(null);
    
    try {
      await applicationApi.apply({ needId: Number(id), message: applyMessage });
      toast.success('申请成功');
      setApplyModal(false);
      setApplyMessage('');
      setApplyError(null);
      fetchData();
    } catch (error) {
      setApplyError(error instanceof Error ? error.message : '申请失败');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDelete = async () => {
    await needApi.delete(Number(id));
    navigate('/needs/my');
  };

  const handleStatusChange = async (status: string) => {
    await needApi.updateStatus(Number(id), status);
    fetchData();
  };

  const handleApplicationStatus = async (appId: number, status: string) => {
    await applicationApi.updateStatus(appId, status);
    fetchData();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;
  }

  if (!need) {
    return <div className="card" style={{ textAlign: 'center', padding: 64 }}>需求不存在</div>;
  }

  const status = statusConfig[need.status] || statusConfig.OPEN;
  const type = typeConfig[need.studyType] || typeConfig.SELF_STUDY;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}
        style={{ marginBottom: 16, color: 'var(--gray-500)' }}>返回</Button>

      {/* Main Card */}
      <div className="card-elevated mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 12, letterSpacing: '-0.02em' }}>{need.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: status.color, background: status.bg, padding: '4px 12px', borderRadius: 'var(--radius-sm)' }}>
                {NEED_STATUS_MAP[need.status]}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, color: type.color, background: type.bg, padding: '4px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span>{type.icon}</span>{STUDY_TYPE_MAP[need.studyType]}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-600)', background: 'var(--gray-100)', padding: '4px 12px', borderRadius: 'var(--radius-sm)' }}>
                {need.courseName}
              </span>
            </div>
          </div>
          {isOwner && (
            <Space>
              <Button icon={<EditOutlined />} onClick={() => navigate(`/needs/${id}/edit`)}>编辑</Button>
              <Popconfirm title="确定删除该需求？" onConfirm={handleDelete} okText="确定" cancelText="取消">
                <Button danger icon={<DeleteOutlined />}>删除</Button>
              </Popconfirm>
            </Space>
          )}
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ClockCircleOutlined style={{ color: 'var(--primary-500)' }} />
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>学习时间</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{need.studyDate}</div>
            <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>{need.startTime} - {need.endTime}</div>
          </div>
          <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <EnvironmentOutlined style={{ color: 'var(--accent-500)' }} />
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>学习地点</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{LOCATION_TYPE_MAP[need.locationType]}</div>
            {need.locationDetail && <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>{need.locationDetail}</div>}
          </div>
          <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TeamOutlined style={{ color: 'var(--success-500)' }} />
              <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>招募人数</span>
            </div>
            <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{need.partnerCount} 人</div>
            <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>已有 {need.applicationCount || 0} 人申请</div>
          </div>
        </div>

        {/* Description */}
        {need.description && (
          <div style={{ padding: 20, background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%)', borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--gray-700)' }}>详细描述</div>
            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--gray-600)', lineHeight: 1.7 }}>{need.description}</div>
          </div>
        )}

        {/* Publisher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
          <Avatar size={56} icon={<UserOutlined />} src={need.publisher?.avatar} style={{ background: 'var(--gradient-primary)' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--gray-800)' }}>{need.publisher?.nickname}</div>
            <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>发布于 {need.createdAt}</div>
          </div>
        </div>
      </div>

      {/* Apply Section - 自己发布的帖子不能申请 */}
      {!isOwner && (
        <div className="card-elevated mb-6">
          <h3 className="section-title">申请加入</h3>
          {hasApplied ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 'var(--radius-sm)',
                color: myApplication?.status === 'ACCEPTED' ? '#16a34a' : myApplication?.status === 'REJECTED' ? '#dc2626' : '#d97706',
                background: myApplication?.status === 'ACCEPTED' ? '#f0fdf4' : myApplication?.status === 'REJECTED' ? '#fef2f2' : '#fffbeb' }}>
                {APPLICATION_STATUS_MAP[myApplication?.status || 'PENDING']}
              </span>
              <span style={{ color: 'var(--gray-500)', fontSize: 14 }}>您已于 {myApplication?.createdAt} 提交申请</span>
            </div>
          ) : need.status === 'OPEN' ? (
            <Button type="primary" size="large" onClick={() => { setApplyModal(true); setApplyMessage(''); setApplyError(null); }}>申请加入</Button>
          ) : (
            <span style={{ color: 'var(--gray-400)' }}>该需求已不接受申请</span>
          )}
        </div>
      )}

      {/* Owner Management */}
      {isOwner && (
        <>
          <div className="card-elevated mb-6">
            <h3 className="section-title">需求状态管理</h3>
            <Space>
              {need.status === 'OPEN' && (
                <>
                  <Button onClick={() => handleStatusChange('MATCHED')}>标记为已匹配</Button>
                  <Button onClick={() => handleStatusChange('CANCELLED')}>取消需求</Button>
                </>
              )}
              {need.status === 'MATCHED' && (
                <Button type="primary" onClick={() => handleStatusChange('COMPLETED')}>标记为已完成</Button>
              )}
            </Space>
          </div>

          <div className="card-elevated">
            <h3 className="section-title">申请者列表 ({applications.length})</h3>
            {applications.length === 0 ? (
              <div style={{ color: 'var(--gray-400)', textAlign: 'center', padding: 32 }}>暂无申请</div>
            ) : (
              <List dataSource={applications} renderItem={(app) => (
                <List.Item style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', marginBottom: 8, padding: 16 }}
                  actions={app.status === 'PENDING' ? [
                    <Button key="accept" type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleApplicationStatus(app.id, 'ACCEPTED')}>通过</Button>,
                    <Button key="reject" size="small" danger icon={<CloseOutlined />} onClick={() => handleApplicationStatus(app.id, 'REJECTED')}>拒绝</Button>,
                  ] : [
                    <span key="status" style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                      color: app.status === 'ACCEPTED' ? '#16a34a' : '#dc2626',
                      background: app.status === 'ACCEPTED' ? '#f0fdf4' : '#fef2f2' }}>
                      {APPLICATION_STATUS_MAP[app.status]}
                    </span>
                  ]}>
                  <List.Item.Meta
                    avatar={<Avatar size={44} icon={<UserOutlined />} src={app.applicant?.avatar} style={{ background: 'var(--gradient-primary)' }} />}
                    title={<span style={{ fontWeight: 600 }}>{app.applicant?.nickname}</span>}
                    description={<><div style={{ color: 'var(--gray-600)' }}>{app.message || '无留言'}</div><div style={{ color: 'var(--gray-400)', fontSize: 12, marginTop: 4 }}>{app.createdAt}</div></>}
                  />
                </List.Item>
              )} />
            )}
          </div>
        </>
      )}

      <Modal title={<span style={{ fontWeight: 600 }}>申请加入</span>} open={applyModal}
        onCancel={() => { setApplyModal(false); setApplyError(null); }}
        footer={[
          <Button key="cancel" onClick={() => { setApplyModal(false); setApplyError(null); }}>取消</Button>,
          <Button key="submit" type="primary" loading={applyLoading} disabled={applyLoading} onClick={handleApply}>提交申请</Button>,
        ]}
      >
        <div style={{ marginTop: 16 }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: 12, fontSize: 14 }}>给发布者留言，介绍一下自己吧</p>
          <Input.TextArea rows={4} placeholder="例如：我是大二计算机专业的，对这门课很感兴趣..." value={applyMessage}
            onChange={(e) => { setApplyMessage(e.target.value); setApplyError(null); }} 
            maxLength={500} showCount style={{ resize: 'none' }} />
          {applyError && (
            <div style={{ color: '#ff4d4f', fontSize: 13, marginTop: 4 }}>{applyError}</div>
          )}
        </div>
      </Modal>
    </div>
  );
}
