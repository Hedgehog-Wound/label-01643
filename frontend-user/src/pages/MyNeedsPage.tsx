import { useState, useEffect } from 'react';
import { Tabs, Empty, Spin, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { needApi } from '../api/need';
import NeedCard from '../components/NeedCard';
import type { LearningNeed } from '../types';

export default function MyNeedsPage() {
  const navigate = useNavigate();
  const [allNeeds, setAllNeeds] = useState<LearningNeed[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<LearningNeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  // 获取所有需求用于统计
  const fetchAllNeeds = async () => {
    setLoading(true);
    try {
      const result = await needApi.getMyNeeds({ page: 1, size: 100 });
      setAllNeeds(result.records);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNeeds();
  }, []);

  // 根据状态筛选
  useEffect(() => {
    if (status) {
      setFilteredNeeds(allNeeds.filter((n) => n.status === status));
    } else {
      setFilteredNeeds(allNeeds);
    }
  }, [status, allNeeds]);

  const tabItems = [
    { key: '', label: '全部' },
    { key: 'OPEN', label: '进行中' },
    { key: 'MATCHED', label: '已匹配' },
    { key: 'COMPLETED', label: '已完成' },
    { key: 'CANCELLED', label: '已取消' },
  ];

  // Stats - 始终基于全部数据计算
  const stats = {
    total: allNeeds.length,
    open: allNeeds.filter((n) => n.status === 'OPEN').length,
    matched: allNeeds.filter((n) => n.status === 'MATCHED').length,
    completed: allNeeds.filter((n) => n.status === 'COMPLETED').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 8 }}>我的需求</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>管理你发布的学习需求</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/needs/create')}>
          发布需求
        </Button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-800)', marginBottom: 4 }}>
            {stats.total}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>全部需求</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--success-500)', marginBottom: 4 }}>
            {stats.open}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>进行中</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary-500)', marginBottom: 4 }}>
            {stats.matched}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>已匹配</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--gray-400)', marginBottom: 4 }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>已完成</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-elevated" style={{ padding: '4px 16px 0' }}>
        <Tabs
          activeKey={status || ''}
          onChange={(k) => setStatus(k || undefined)}
          items={tabItems}
        />
      </div>

      {/* List */}
      <div style={{ marginTop: 24 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 64 }}>
            <Spin size="large" />
          </div>
        ) : filteredNeeds.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 64 }}>
            <Empty
              description={
                <span style={{ color: 'var(--gray-400)' }}>
                  {status ? '该状态下暂无需求' : '你还没有发布过需求'}
                </span>
              }
            />
            {!status && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginTop: 16 }}
                onClick={() => navigate('/needs/create')}
              >
                发布第一个需求
              </Button>
            )}
          </div>
        ) : (
          filteredNeeds.map((need, index) => (
            <div key={need.id} style={{ animationDelay: `${index * 50}ms` }}>
              <NeedCard need={need} showApplyBtn={false} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
