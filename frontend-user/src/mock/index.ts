import type { User, LearningNeed, Application, PageResult } from '../types';
import {
  mockUsers, mockNeeds, mockApplications, mockCourses,
  currentUser, setCurrentUser, getNextNeedId, getNextApplicationId,
} from './data';

// 模拟网络延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API Mock
export const mockAuthApi = {
  login: async (username: string, password: string): Promise<{ token: string; user: User }> => {
    await delay(500);
    // 验证密码
    if (password !== 'admin123') {
      throw new Error('密码错误');
    }
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      return { token: `mock-token-${user.id}`, user };
    }
    // 如果用户不存在，创建一个新用户
    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      nickname: username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      email: `${username}@edu.cn`,
    };
    mockUsers.push(newUser);
    setCurrentUser(newUser);
    return { token: `mock-token-${newUser.id}`, user: newUser };
  },

  register: async (username: string, _password: string, nickname: string): Promise<User> => {
    await delay(500);
    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      email: `${username}@edu.cn`,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  getMe: async (): Promise<User> => {
    await delay(200);
    if (!currentUser) {
      // 从 token 中恢复用户
      const token = localStorage.getItem('token');
      if (token) {
        const match = token.match(/mock-token-(\d+)/);
        if (match) {
          const userId = parseInt(match[1], 10);
          const user = mockUsers.find(u => u.id === userId);
          if (user) {
            setCurrentUser(user);
            return user;
          }
        }
      }
      throw new Error('未登录');
    }
    return currentUser;
  },
};

// Need API Mock
export const mockNeedApi = {
  create: async (params: Partial<LearningNeed>): Promise<LearningNeed> => {
    await delay(400);
    const user = currentUser || mockUsers[0];
    const newNeed: LearningNeed = {
      id: getNextNeedId(),
      userId: user.id,
      title: params.title || '',
      courseName: params.courseName || '',
      studyType: params.studyType || 'SELF_STUDY',
      studyDate: params.studyDate || '',
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      locationType: params.locationType || 'OTHER',
      locationDetail: params.locationDetail || '',
      description: params.description || '',
      partnerCount: params.partnerCount || 1,
      status: 'OPEN',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      publisher: user,
      applicationCount: 0,
    };
    mockNeeds.unshift(newNeed);
    return newNeed;
  },

  list: async (params: {
    page?: number; size?: number; courses?: string[]; studyTypes?: string[];
    locationTypes?: string[]; statuses?: string[]; sortBy?: string;
  }): Promise<PageResult<LearningNeed>> => {
    await delay(300);
    let filtered = [...mockNeeds];

    if (params.courses?.length) {
      filtered = filtered.filter(n => params.courses!.includes(n.courseName));
    }
    if (params.studyTypes?.length) {
      filtered = filtered.filter(n => params.studyTypes!.includes(n.studyType));
    }
    if (params.locationTypes?.length) {
      filtered = filtered.filter(n => params.locationTypes!.includes(n.locationType));
    }
    if (params.statuses?.length) {
      filtered = filtered.filter(n => params.statuses!.includes(n.status));
    }

    // 排序
    if (params.sortBy === 'studyDate') {
      filtered.sort((a, b) => a.studyDate.localeCompare(b.studyDate));
    } else if (params.sortBy === 'applicationCount') {
      filtered.sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0));
    }

    const page = params.page || 1;
    const size = params.size || 10;
    const start = (page - 1) * size;
    const records = filtered.slice(start, start + size);

    return { records, total: filtered.length, current: page, size };
  },

  getById: async (id: number): Promise<{ need: LearningNeed; hasApplied: boolean; myApplication: Application | null }> => {
    await delay(200);
    const need = mockNeeds.find(n => n.id === id);
    if (!need) throw new Error('需求不存在');

    const user = currentUser || mockUsers[0];
    const myApplication = mockApplications.find(a => a.needId === id && a.applicantId === user.id) || null;

    return { need, hasApplied: !!myApplication, myApplication };
  },

  update: async (id: number, params: Partial<LearningNeed>): Promise<LearningNeed> => {
    await delay(300);
    const index = mockNeeds.findIndex(n => n.id === id);
    if (index === -1) throw new Error('需求不存在');
    mockNeeds[index] = { ...mockNeeds[index], ...params };
    return mockNeeds[index];
  },

  delete: async (id: number): Promise<void> => {
    await delay(300);
    const index = mockNeeds.findIndex(n => n.id === id);
    if (index !== -1) mockNeeds.splice(index, 1);
  },

  getMyNeeds: async (params: { status?: string }): Promise<PageResult<LearningNeed>> => {
    await delay(300);
    const user = currentUser || mockUsers[0];
    let filtered = mockNeeds.filter(n => n.userId === user.id);
    if (params.status) {
      filtered = filtered.filter(n => n.status === params.status);
    }
    return { records: filtered, total: filtered.length, current: 1, size: 100 };
  },

  updateStatus: async (id: number, status: string): Promise<void> => {
    await delay(200);
    const need = mockNeeds.find(n => n.id === id);
    if (need) need.status = status as LearningNeed['status'];
  },

  searchCourses: async (): Promise<string[]> => {
    await delay(100);
    return mockCourses;
  },
};

// Application API Mock
export const mockApplicationApi = {
  apply: async (params: { needId: number; message?: string }): Promise<Application> => {
    await delay(300);
    
    // 如果 currentUser 为空，尝试从 token 恢复
    let user = currentUser;
    if (!user) {
      const token = localStorage.getItem('token');
      if (token) {
        const match = token.match(/mock-token-(\d+)/);
        if (match) {
          const userId = parseInt(match[1], 10);
          const foundUser = mockUsers.find(u => u.id === userId);
          if (foundUser) {
            setCurrentUser(foundUser);
            user = foundUser;
          }
        }
      }
    }
    
    if (!user) {
      throw new Error('请先登录');
    }
    
    const newApp: Application = {
      id: getNextApplicationId(),
      needId: params.needId,
      applicantId: user.id,
      message: params.message || '',
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      applicant: user,
    };
    mockApplications.push(newApp);

    // 更新需求的申请数
    const need = mockNeeds.find(n => n.id === params.needId);
    if (need) need.applicationCount = (need.applicationCount || 0) + 1;

    return newApp;
  },

  getByNeedId: async (needId: number): Promise<Application[]> => {
    await delay(200);
    return mockApplications.filter(a => a.needId === needId);
  },

  updateStatus: async (id: number, status: string): Promise<void> => {
    await delay(200);
    const app = mockApplications.find(a => a.id === id);
    if (app) app.status = status as Application['status'];
  },

  getMyApplications: async (): Promise<(Application & { need?: LearningNeed })[]> => {
    await delay(300);
    let user = currentUser;
    if (!user) {
      const token = localStorage.getItem('token');
      if (token) {
        const match = token.match(/mock-token-(\d+)/);
        if (match) {
          const userId = parseInt(match[1], 10);
          user = mockUsers.find(u => u.id === userId) || null;
        }
      }
    }
    if (!user) return [];
    
    const myApps = mockApplications.filter(a => a.applicantId === user!.id);
    return myApps.map(app => ({
      ...app,
      need: mockNeeds.find(n => n.id === app.needId),
    }));
  },
};
