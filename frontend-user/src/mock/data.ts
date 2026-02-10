import type { User, LearningNeed, Application, StudyType, LocationType, NeedStatus, ApplicationStatus } from '../types';

// Mock 用户数据
export const mockUsers: User[] = [
  { id: 1, username: 'zhangsan', nickname: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', email: 'zhangsan@edu.cn' },
  { id: 2, username: 'lisi', nickname: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', email: 'lisi@edu.cn' },
  { id: 3, username: 'wangwu', nickname: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', email: 'wangwu@edu.cn' },
  { id: 4, username: 'zhaoliu', nickname: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', email: 'zhaoliu@edu.cn' },
  { id: 5, username: 'sunqi', nickname: '孙七', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', email: 'sunqi@edu.cn' },
];

// Mock 课程列表
export const mockCourses = [
  '高等数学', '线性代数', '概率论与数理统计', '大学物理', '大学英语',
  '数据结构', '计算机网络', '操作系统', '数据库原理', '软件工程',
  '机器学习', '人工智能', '深度学习', 'Python编程', 'Java程序设计',
  '微观经济学', '宏观经济学', '会计学原理', '市场营销', '管理学',
];

// 生成随机日期
const getRandomFutureDate = (daysAhead: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  return date.toISOString().split('T')[0];
};

const getRandomPastDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

// Mock 学习需求数据
export const mockNeeds: LearningNeed[] = [
  {
    id: 1, userId: 2, title: '高数期末复习找搭子', courseName: '高等数学',
    studyType: 'EXAM_REVIEW' as StudyType, studyDate: getRandomFutureDate(7), startTime: '14:00', endTime: '17:00',
    locationType: 'LIBRARY' as LocationType, locationDetail: '图书馆三楼自习室',
    description: '期末考试快到了，想找几个同学一起复习高数，互相讨论难题，争取都能考个好成绩！',
    partnerCount: 3, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(2),
    publisher: mockUsers[1], applicationCount: 2,
  },
  {
    id: 2, userId: 3, title: '数据结构刷题小组', courseName: '数据结构',
    studyType: 'EXAM_REVIEW' as StudyType, studyDate: getRandomFutureDate(5), startTime: '19:00', endTime: '21:00',
    locationType: 'ONLINE' as LocationType, locationDetail: '',
    description: '一起刷LeetCode，准备数据结构考试，每天晚上在线讨论算法题。',
    partnerCount: 4, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(1),
    publisher: mockUsers[2], applicationCount: 5,
  },
  {
    id: 3, userId: 4, title: '软件工程课程项目组队', courseName: '软件工程',
    studyType: 'PROJECT' as StudyType, studyDate: getRandomFutureDate(14), startTime: '10:00', endTime: '12:00',
    locationType: 'CLASSROOM' as LocationType, locationDetail: '教学楼A301',
    description: '软件工程大作业需要组队，计划做一个校园二手交易平台，需要前后端开发同学。',
    partnerCount: 5, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(3),
    publisher: mockUsers[3], applicationCount: 3,
  },
  {
    id: 4, userId: 5, title: '英语四级备考', courseName: '大学英语',
    studyType: 'EXAM_REVIEW' as StudyType, studyDate: getRandomFutureDate(10), startTime: '08:00', endTime: '10:00',
    locationType: 'LIBRARY' as LocationType, locationDetail: '图书馆二楼',
    description: '四级考试倒计时，找人一起背单词、练听力、做真题。',
    partnerCount: 2, status: 'MATCHED' as NeedStatus, createdAt: getRandomPastDate(5),
    publisher: mockUsers[4], applicationCount: 4,
  },
  {
    id: 5, userId: 1, title: '机器学习论文研读', courseName: '机器学习',
    studyType: 'SELF_STUDY' as StudyType, studyDate: getRandomFutureDate(3), startTime: '15:00', endTime: '18:00',
    locationType: 'ONLINE' as LocationType, locationDetail: '',
    description: '一起读经典ML论文，每周讨论一篇，互相分享理解和心得。',
    partnerCount: 3, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(1),
    publisher: mockUsers[0], applicationCount: 1,
  },
  {
    id: 6, userId: 2, title: 'ACM竞赛训练', courseName: 'Python编程',
    studyType: 'COMPETITION' as StudyType, studyDate: getRandomFutureDate(7), startTime: '13:00', endTime: '17:00',
    locationType: 'CLASSROOM' as LocationType, locationDetail: '计算机楼机房',
    description: '准备参加ACM校赛，找队友一起训练，最好有算法基础。',
    partnerCount: 2, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(4),
    publisher: mockUsers[1], applicationCount: 6,
  },
  {
    id: 7, userId: 3, title: '线性代数作业讨论', courseName: '线性代数',
    studyType: 'HOMEWORK' as StudyType, studyDate: getRandomFutureDate(2), startTime: '20:00', endTime: '22:00',
    locationType: 'ONLINE' as LocationType, locationDetail: '',
    description: '这周的线代作业太难了，找人一起讨论下思路。',
    partnerCount: 2, status: 'COMPLETED' as NeedStatus, createdAt: getRandomPastDate(7),
    publisher: mockUsers[2], applicationCount: 2,
  },
  {
    id: 8, userId: 4, title: '计算机网络实验', courseName: '计算机网络',
    studyType: 'PROJECT' as StudyType, studyDate: getRandomFutureDate(5), startTime: '14:00', endTime: '16:00',
    locationType: 'CLASSROOM' as LocationType, locationDetail: '网络实验室',
    description: '计网实验需要组队完成，一起配置路由器和交换机。',
    partnerCount: 3, status: 'OPEN' as NeedStatus, createdAt: getRandomPastDate(2),
    publisher: mockUsers[3], applicationCount: 1,
  },
];

// Mock 申请数据
export const mockApplications: Application[] = [
  { id: 1, needId: 1, applicantId: 1, message: '我高数学得还不错，希望能一起复习！', status: 'PENDING' as ApplicationStatus, createdAt: getRandomPastDate(1), applicant: mockUsers[0] },
  { id: 2, needId: 1, applicantId: 3, message: '我也想参加，可以互相讨论难题', status: 'ACCEPTED' as ApplicationStatus, createdAt: getRandomPastDate(1), applicant: mockUsers[2] },
  { id: 3, needId: 2, applicantId: 1, message: '算法爱好者，想一起刷题', status: 'PENDING' as ApplicationStatus, createdAt: getRandomPastDate(1), applicant: mockUsers[0] },
  { id: 4, needId: 2, applicantId: 4, message: '我LeetCode刷了200多题了', status: 'ACCEPTED' as ApplicationStatus, createdAt: getRandomPastDate(2), applicant: mockUsers[3] },
  { id: 5, needId: 3, applicantId: 1, message: '我会React和Node.js，可以做前端', status: 'PENDING' as ApplicationStatus, createdAt: getRandomPastDate(1), applicant: mockUsers[0] },
  { id: 6, needId: 5, applicantId: 2, message: '对ML很感兴趣，想一起学习', status: 'PENDING' as ApplicationStatus, createdAt: getRandomPastDate(1), applicant: mockUsers[1] },
];

// 当前登录用户（默认用户1）
export let currentUser: User | null = null;

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

// ID 计数器
let needIdCounter = mockNeeds.length + 1;
let applicationIdCounter = mockApplications.length + 1;

export const getNextNeedId = () => needIdCounter++;
export const getNextApplicationId = () => applicationIdCounter++;
