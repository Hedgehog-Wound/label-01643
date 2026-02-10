import { mockNeedApi } from '../mock';
import type { LearningNeed, PageResult, Application } from '../types';

export interface NeedCreateParams {
  title: string;
  courseName: string;
  studyType: string;
  studyDate: string;
  startTime: string;
  endTime: string;
  locationType: string;
  locationDetail?: string;
  description?: string;
  partnerCount: number;
}

export interface NeedQueryParams {
  page?: number;
  size?: number;
  courses?: string[];
  studyTypes?: string[];
  locationTypes?: string[];
  statuses?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface NeedDetailResult {
  need: LearningNeed;
  hasApplied: boolean;
  myApplication: Application | null;
}

export const needApi = {
  create: (params: NeedCreateParams): Promise<LearningNeed> =>
    mockNeedApi.create(params as unknown as Partial<LearningNeed>),

  list: (params: NeedQueryParams): Promise<PageResult<LearningNeed>> =>
    mockNeedApi.list(params),

  getById: (id: number): Promise<NeedDetailResult> =>
    mockNeedApi.getById(id),

  update: (id: number, params: Partial<NeedCreateParams>): Promise<LearningNeed> =>
    mockNeedApi.update(id, params as unknown as Partial<LearningNeed>),

  delete: (id: number): Promise<void> =>
    mockNeedApi.delete(id),

  getMyNeeds: (params: { status?: string; page?: number; size?: number }): Promise<PageResult<LearningNeed>> =>
    mockNeedApi.getMyNeeds(params),

  updateStatus: (id: number, status: string): Promise<void> =>
    mockNeedApi.updateStatus(id, status),

  searchCourses: (_keyword?: string): Promise<string[]> =>
    mockNeedApi.searchCourses(),
};
