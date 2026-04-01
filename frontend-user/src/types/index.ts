export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
}

export interface LearningNeed {
  id: number;
  userId: number;
  title: string;
  courseName: string;
  studyType: StudyType;
  studyDate: string;
  startTime: string;
  endTime: string;
  locationType: LocationType;
  locationDetail: string;
  description: string;
  partnerCount: number;
  status: NeedStatus;
  createdAt: string;
  publisher?: User;
  applicationCount?: number;
}

export interface Application {
  id: number;
  needId: number;
  applicantId: number;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
  applicant?: User;
}

export type StudyType = 'EXAM_REVIEW' | 'HOMEWORK' | 'PROJECT' | 'SELF_STUDY' | 'COMPETITION';
export type LocationType = 'ONLINE' | 'LIBRARY' | 'CLASSROOM' | 'OTHER';
export type NeedStatus = 'OPEN' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export const STUDY_TYPE_MAP: Record<StudyType, string> = {
  EXAM_REVIEW: '考试复习',
  HOMEWORK: '作业讨论',
  PROJECT: '项目合作',
  SELF_STUDY: '日常自习',
  COMPETITION: '竞赛准备',
};

export const LOCATION_TYPE_MAP: Record<LocationType, string> = {
  ONLINE: '线上',
  LIBRARY: '图书馆',
  CLASSROOM: '教学楼教室',
  OTHER: '其他',
};

export const NEED_STATUS_MAP: Record<NeedStatus, string> = {
  OPEN: '进行中',
  MATCHED: '已匹配',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

export const APPLICATION_STATUS_MAP: Record<ApplicationStatus, string> = {
  PENDING: '待审核',
  ACCEPTED: '已通过',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
