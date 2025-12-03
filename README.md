# Love Share

Love Share 是一个基于 React + TypeScript + Vite 构建的现代化数据展示平台，集成了 Supabase 后端服务，提供了表格视图和卡片视图切换、搜索、分页、分类筛选等功能。

## 技术栈

### 前端

- **框架**: React 19
- **语言**: TypeScript
- **构建工具**: Vite (使用 rolldown-vite)
- **UI 组件库**: Material UI (MUI) v7
- **状态管理**: React Context + React Query
- **主题管理**: 自定义 ThemeContext
- **代码规范**: ESLint + TypeScript ESLint

### 后端

- **数据库**: Supabase
- **API**: Supabase REST API

## 项目特点

- 🔥 **现代化技术栈**: 使用 React 19、TypeScript 和 Vite 构建，性能优异
- 🎨 **美观的 UI 设计**: 基于 Material UI 构建，支持主题切换
- 📊 **多种视图模式**: 支持表格视图和卡片视图切换
- 🔍 **强大的搜索功能**: 支持多字段搜索
- 📄 **分页功能**: 支持自定义每页显示数量
- 📁 **分类筛选**: 支持按分类筛选数据
- 🔄 **实时数据更新**: 使用 React Query 实现数据缓存和自动失效
- 💪 **类型安全**: 全面的 TypeScript 支持
- 📱 **响应式设计**: 适配各种屏幕尺寸

## 项目结构

```
src/
├── assets/              # 静态资源
│   ├── styles/          # 全局样式
│   └── react.svg        # React 图标
├── components/          # 组件
│   ├── common/          # 通用组件
│   ├── features/        # 功能组件
│   └── layout/          # 布局组件
├── contexts/            # React Context
│   ├── TableContext.tsx # 表格数据上下文
│   └── ThemeContext.tsx # 主题上下文
├── lib/                 # 工具库
│   ├── supabase.ts      # Supabase 客户端
│   └── utils.ts         # 通用工具函数
├── pages/               # 页面组件
│   └── Home.tsx         # 主页
├── App.css              # App 样式
├── App.tsx              # App 组件
├── index.css            # 全局样式
└── main.tsx             # 应用入口
```

## 快速开始

### 前置要求

- Node.js 18+ 或 Bun
- pnpm (推荐) 或 npm/yarn
- Supabase 账号和项目

### 安装

1. 克隆项目

```bash
git clone <repository-url>
cd love_share
```

2. 安装依赖

```bash
pnpm install
# 或使用 npm
npm install
# 或使用 yarn
yarn install
```

3. 配置环境变量

创建 `.env.local` 文件，根据 `.env.example` 配置环境变量：

```env
# 系统配置
VITE_SYSTEM_NAME=Love Share
VITE_HOME_INTRO=这是一个现代化数据展示平台...
VITE_HOME_FOOTER=© 2025 Love Share

# Supabase 配置
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-anon-key>
VITE_SUPABASE_PAGE_SIZE=8

# 表配置
VITE_SUPABASE_TABLE_DIC={"table1":{"show_name":"表1"},"table2":{"show_name":"表2"}}
VITE_SUPABASE_TABLE_CATEGORY_COL={"table1":"category"}
VITE_SUPABASE_TABLE_CATEGORY_ENABLE={"table1":true}
VITE_SUPABASE_TABLE_SHOW_COL_THUMB={"table1":["url"]}
VITE_SUPABASE_TABLE_SHOW_VIEWS={"table1":["table","card"]}
VITE_SUPABASE_TABLE_DEFAULT_SEARCH={"table1":["name","description"]}
```

### 运行

```bash
pnpm dev
# 或使用 npm
npm run dev
# 或使用 yarn
yarn dev
```

访问 `http://localhost:5173` 查看应用

### 构建

```bash
pnpm build
# 或使用 npm
npm run build
# 或使用 yarn
yarn build
```

### 预览构建结果

```bash
pnpm preview
# 或使用 npm
npm run preview
# 或使用 yarn
yarn preview
```

## 主要功能

### 1. 表格视图

- 支持自定义列显示
- 支持单元格内容缩略显示
- 支持链接自动识别和跳转
- 支持响应式设计

### 2. 卡片视图

- 支持自定义卡片布局
- 支持图片显示
- 支持响应式设计

### 3. 导航卡片视图

- 专门为导航数据设计的卡片视图
- 支持图标和链接

### 4. 搜索功能

- 支持多字段搜索
- 支持实时搜索
- 支持搜索提示

### 5. 分页功能

- 支持自定义每页显示数量
- 支持快速跳转页码
- 支持显示总条数

### 6. 分类筛选

- 支持按分类筛选数据
- 支持多级分类

### 7. 主题切换

- 支持浅色/深色主题切换
- 支持系统主题自动检测

## 配置说明

### 环境变量

| 变量名                                | 说明              | 示例                                    |
| ------------------------------------- | ----------------- | --------------------------------------- |
| VITE_SYSTEM_NAME                      | 系统名称          | Love Share                              |
| VITE_HOME_INTRO                       | 主页介绍          | 这是一个现代化数据展示平台...           |
| VITE_HOME_FOOTER                      | 页脚信息          | © 2025 Love Share                       |
| VITE_SUPABASE_URL                     | Supabase 项目 URL | https://example.supabase.co             |
| VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY | Supabase 匿名密钥 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... |
| VITE_SUPABASE_PAGE_SIZE               | 每页显示数量      | 8                                       |
| VITE_SUPABASE_TABLE_DIC               | 表配置            | {"table1":{"show_name":"表 1"}}         |
| VITE_SUPABASE_TABLE_CATEGORY_COL      | 分类列配置        | {"table1":"category"}                   |
| VITE_SUPABASE_TABLE_CATEGORY_ENABLE   | 分类启用配置      | {"table1":true}                         |
| VITE_SUPABASE_TABLE_SHOW_COL_THUMB    | 缩略显示字段配置  | {"table1":["url"]}                      |
| VITE_SUPABASE_TABLE_SHOW_VIEWS        | 视图配置          | {"table1":["table","card"]}             |
| VITE_SUPABASE_TABLE_DEFAULT_SEARCH    | 搜索配置          | {"table1":["name","description"]}       |

## 开发指南

### 代码规范

项目使用 ESLint 和 TypeScript ESLint 进行代码规范检查，运行以下命令检查代码：

```bash
pnpm lint
# 或使用 npm
npm run lint
```

### 类型检查

运行以下命令进行 TypeScript 类型检查：

```bash
pnpm typecheck
# 或使用 npm
npm run typecheck
```

## 部署

### Vercel

1. 登录 Vercel
2. 导入项目
3. 配置环境变量
4. 部署

### Netlify

1. 登录 Netlify
2. 导入项目
3. 配置环境变量
4. 部署

### GitHub Pages

1. 配置 `vite.config.ts` 中的 `base` 选项
2. 运行 `pnpm build` 构建项目
3. 部署 `dist` 目录到 GitHub Pages

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 致谢

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Supabase](https://supabase.com/)
- [React Query](https://tanstack.com/query/v5/)
