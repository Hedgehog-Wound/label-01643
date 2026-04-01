import { mockApplicationApi } from '../mock';
import type { Application, LearningNeed } from '../types';

export interface ApplyParams {
  needId: number;
  message?: string;
}

export const applicationApi = {
  apply: (params: ApplyParams): Promise<Application> =>
    mockApplicationApi.apply(params),

  getByNeedId: (needId: number): Promise<Application[]> =>
    mockApplicationApi.getByNeedId(needId),

  updateStatus: (id: number, status: string): Promise<void> =>
    mockApplicationApi.updateStatus(id, status),

  getMyApplications: (): Promise<(Application & { need?: LearningNeed })[]> =>
    mockApplicationApi.getMyApplications(),

  cancelApplication: (id: number): Promise<void> =>
    mockApplicationApi.cancelApplication(id),
};
