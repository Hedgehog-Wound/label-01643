import { Avatar, Button } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { LearningNeed } from '../types';
import { STUDY_TYPE_MAP, LOCATION_TYPE_MAP, NEED_STATUS_MAP } from '../types';
import { useAuthStore } from '../store/authStore';

interface Props {
  need: LearningNeed;
  onApply?: (id: number) => void;
  showApplyBtn?: boolean;
}

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

export default function NeedCard({ need, onApply, showApplyBtn = true }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const status = statusConfig[need.status] || statusConfig.OPEN;
  const type = typeConfig[need.studyType] || typeConfig.SELF_STUDY;
  const isOwner = user?.id === need.userId;

  return (
    <div
      className="card-interactive animate-fade-in-up"
      style={{ marginBottom: 16 }}
      onClick={() => navigate(`/needs/${need.id}`)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: 'var(--gray-900)',
                letterSpacing: '-0.01em',
              }}
            >
              {need.title}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: status.color,
                background: status.bg,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {NEED_STATUS_MAP[need.status]}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                fontWeight: 500,
                color: type.color,
                background: type.bg,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span>{type.icon}</span>
              {STUDY_TYPE_MAP[need.studyType]}
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--gray-600)',
                background: 'var(--gray-100)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {need.courseName}
            </span>
          </div>
        </div>

        {/* Publisher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            background: 'var(--gray-50)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Avatar
            size={36}
            icon={<UserOutlined />}
            src={need.publisher?.avatar}
            style={{ background: 'var(--gradient-primary)' }}
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>
              {need.publisher?.nickname}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>发布者</div>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          padding: '12px 16px',
          background: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          marginBottom: showApplyBtn && need.status === 'OPEN' ? 16 : 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)' }}>
          <ClockCircleOutlined style={{ fontSize: 14, color: 'var(--primary-500)' }} />
          <span style={{ fontSize: 13 }}>
            {need.studyDate} {need.startTime}-{need.endTime}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)' }}>
          <EnvironmentOutlined style={{ fontSize: 14, color: 'var(--accent-500)' }} />
          <span style={{ fontSize: 13 }}>
            {LOCATION_TYPE_MAP[need.locationType]}
            {need.locationDetail && ` · ${need.locationDetail}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)' }}>
          <TeamOutlined style={{ fontSize: 14, color: 'var(--success-500)' }} />
          <span style={{ fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
              {need.applicationCount || 0}
            </span>
            /{need.partnerCount}人
          </span>
        </div>
      </div>

      {/* Action */}
      {showApplyBtn && need.status === 'OPEN' && !isOwner && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onApply?.(need.id);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexDirection: 'row-reverse',
            }}
          >
            快速申请
          </Button>
        </div>
      )}
    </div>
  );
}
