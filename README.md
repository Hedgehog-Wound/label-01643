# StudyBuddy - 大学学习搭子平台

大学生学习搭子社交平台，用户可以发布学习需求、浏览他人需求并申请匹配。

## How to Run

```bash
docker-compose up --build -d
```

启动后访问 http://localhost:8081

停止服务：`docker-compose down`

## Services

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-user | http://localhost:8081 | React 前端（用户端） |

## 测试账号

本项目使用 Mock 数据，登录密码统一为 `admin123`。

预置用户：zhangsan、lisi、wangwu、zhaoliu、sunqi

也可输入任意用户名 + 密码 admin123 自动创建新用户。

## 题目内容

Role: 资深全栈交付专家 (Senior Full-Stack Delivery Expert)

请使用React + TypeScript + Ant Design开发一个大学学习需求系统的前端Web页面。

项目概述：大学生学习搭子社交平台的核心功能模块——学习需求系统。用户可以发布学习需求、浏览他人需求并申请匹配。

页面功能要求：
1. 需求发布页面 /needs/create - 表单填写、实时验证、草稿保存
2. 需求浏览页面 /needs - 列表展示、多条件筛选、排序、无限滚动
3. 需求详情页面 /needs/:id - 完整信息、申请功能
4. 我的需求管理 /needs/my - 按状态分类显示

技术栈要求：React 18 + TypeScript + Ant Design v5 + Zustand + React Hook Form + zod
