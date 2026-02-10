import { useState, useEffect, useCallback } from 'react';
import { Select, DatePicker, Spin, Empty, Modal, Input, Button } from 'antd';
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import type { LearningNeed } from '../types';
import { STUDY_TYPE_MAP, LOCATION_TYPE_MAP, NEED_STATUS_MAP } from '../types';
import { needApi, type NeedQueryParams } from '../api/need';
import { applicationApi } from '../api/application';
import NeedCard from '../components/NeedCard';

const { RangePicker } = DatePicker;

export default function NeedBrowsePage() {
  const [needs, setNeeds] = useState<LearningNeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [applyModal, setApplyModal] = useState<{ visible: boolean; needId: number | null }>({
    visible: false,
    needId: null,
  });
  const [applyMessage, setApplyMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [tipMsg, setTipMsg] = useState<string | null>(null);
  const [appliedNeedIds, setAppliedNeedIds] = useState<Set<number>>(new Set());

  const [filters, setFilters] = useState<NeedQueryParams>({
    page: 1,
    size: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchNeeds = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        const result = await needApi.list({ ...filters, page: currentPage });
        if (reset) {
          setNeeds(result.records);
          setPage(2);
        } else {
          setNeeds((prev) => [...prev, ...result.records]);
          setPage((p) => p + 1);
        }
        setHasMore(result.records.length === filters.size);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, loading]
  );

  useEffect(() => {
    fetchNeeds(true);
  }, [filters]);

  useEffect(() => {
    needApi.searchCourses().then(setCourses);
    applicationApi.getMyApplications().then((apps) => {
      setAppliedNeedIds(new Set(apps.map((a) => a.needId)));
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (hasMore && !loading) {
          fetchNeeds();
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, fetchNeeds]);

  const handleApply = (needId: number) => {
    setApplyModal({ visible: true, needId });
    setApplyMessage('');
    setTipMsg(null);
  };

  const submitApply = async () => {
    if (!applyModal.needId) return;
    if (!applyMessage.trim()) {
      setTipMsg('请填写申请留言');
      return;
    }
    setApplyLoading(true);
    setTipMsg(null);

    try {
      await applicationApi.apply({ needId: applyModal.needId, message: applyMessage });
      setAppliedNeedIds((prev) => new Set(prev).add(applyModal.needId!));
      setApplyModal({ visible: false, needId: null });
      setApplyMessage('');
      setTipMsg(null);
    } catch (error) {
      setTipMsg(error instanceof Error ? error.message : '申请失败');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title" style={{ marginBottom: 8 }}>发现学习需求</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>找到志同道合的学习伙伴，一起进步</p>
      </div>

      <div className="card-elevated" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showFilters ? 16 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FilterOutlined style={{ color: 'var(--primary-500)' }} />
            <span style={{ fontWeight: 600, color: 'var(--gray-700)' }}>筛选条件</span>
          </div>
          <Button type="text" size="small" onClick={() => setShowFilters(!showFilters)} style={{ color: 'var(--gray-500)' }}>
            {showFilters ? '收起' : '展开'}
          </Button>
        </div>

        {showFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Select mode="multiple" placeholder="课程筛选" style={{ minWidth: 180 }} allowClear maxTagCount={1}
              options={courses.map((c) => ({ label: c, value: c }))}
              onChange={(v) => setFilters((f) => ({ ...f, courses: v }))} />
            <Select mode="multiple" placeholder="学习类型" style={{ minWidth: 140 }} allowClear maxTagCount={1}
              options={Object.entries(STUDY_TYPE_MAP).map(([k, v]) => ({ label: v, value: k }))}
              onChange={(v) => setFilters((f) => ({ ...f, studyTypes: v }))} />
            <Select mode="multiple" placeholder="地点" style={{ minWidth: 120 }} allowClear maxTagCount={1}
              options={Object.entries(LOCATION_TYPE_MAP).map(([k, v]) => ({ label: v, value: k }))}
              onChange={(v) => setFilters((f) => ({ ...f, locationTypes: v }))} />
            <Select mode="multiple" placeholder="状态" style={{ minWidth: 120 }} allowClear maxTagCount={1}
              options={Object.entries(NEED_STATUS_MAP).map(([k, v]) => ({ label: v, value: k }))}
              onChange={(v) => setFilters((f) => ({ ...f, statuses: v }))} />
            <RangePicker placeholder={['开始日期', '结束日期']} style={{ minWidth: 240 }}
              onChange={(dates) => setFilters((f) => ({ ...f, startDate: dates?.[0]?.format('YYYY-MM-DD'), endDate: dates?.[1]?.format('YYYY-MM-DD') }))} />
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <SortAscendingOutlined style={{ color: 'var(--gray-400)' }} />
              <Select placeholder="排序" style={{ width: 130 }} defaultValue="createdAt"
                options={[{ label: '最新发布', value: 'createdAt' }, { label: '最近开始', value: 'studyDate' }, { label: '最多申请', value: 'applicationCount' }]}
                onChange={(v) => setFilters((f) => ({ ...f, sortBy: v }))} />
            </div>
          </div>
        )}
      </div>

      <div>
        {needs.map((need, index) => (
          <div key={need.id} style={{ animationDelay: `${index * 50}ms` }}>
            <NeedCard need={need} onApply={handleApply} showApplyBtn={!appliedNeedIds.has(need.id)} />
          </div>
        ))}
        {loading && <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>}
        {!loading && needs.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 64 }}>
            <Empty description={<span style={{ color: 'var(--gray-400)' }}>暂无学习需求，快去发布一个吧</span>} />
          </div>
        )}
        {!loading && !hasMore && needs.length > 0 && (
          <div style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 32, fontSize: 14 }}>— 已经到底了 —</div>
        )}
      </div>

      <Modal
        title={<span style={{ fontWeight: 600 }}>申请加入</span>}
        open={applyModal.visible}
        onCancel={() => { setApplyModal({ visible: false, needId: null }); setTipMsg(null); }}
        footer={[
          <Button key="cancel" onClick={() => { setApplyModal({ visible: false, needId: null }); setTipMsg(null); }}>取消</Button>,
          <Button key="submit" type="primary" loading={applyLoading} disabled={applyLoading} onClick={submitApply}>提交申请</Button>,
        ]}
      >
        <div style={{ marginTop: 16 }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: 12, fontSize: 14 }}>给发布者留言，介绍一下自己吧</p>
          <Input.TextArea rows={4} placeholder="例如：我是大二计算机专业的，对这门课很感兴趣..." value={applyMessage}
            onChange={(e) => { setApplyMessage(e.target.value); setTipMsg(null); }}
            maxLength={500} showCount style={{ resize: 'none' }} />
          {tipMsg && (
            <div style={{ color: '#ff4d4f', fontSize: 13, marginTop: 4 }}>{tipMsg}</div>
          )}
        </div>
      </Modal>
    </div>
  );
}
