# Experiment Platform

基于 Vue 3 + Vite + Element Plus 的实验管理平台。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建**: Vite
- **UI 组件库**: Element Plus + @element-plus/icons-vue
- **路由**: Vue Router
- **状态管理**: Pinia
- **HTTP 请求**: Axios
- **工具库**: qrcode.vue、xlsx
- **样式**: SCSS
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── views/                        # 页面视图
│   ├── Home.vue                  # 首页
│   ├── Login.vue                 # 登录
│   ├── Register.vue              # 注册
│   ├── Subject.vue               # 受试者端
│   ├── Researcher.vue            # 研究者端
│   ├── Admin.vue                 # 管理员端
│   ├── About.vue                 # 关于
│   ├── NotFound.vue              # 404
│   ├── ExperimentManagement.vue  # 实验管理
│   ├── ExperimentConfig.vue      # 实验配置
│   ├── CheckInManagement.vue     # 签到管理
│   ├── PaymentManagement.vue     # 报酬管理
│   ├── RegistrationReview.vue    # 注册审核
│   └── ReviewManagement.vue      # 审核管理
├── components/                   # 公共组件
│   └── HelloWorld.vue
├── router/
│   └── index.js                  # 路由配置
├── store/
│   └── index.js                  # Pinia 状态管理
├── api/
│   └── index.js                  # API 接口封装
├── utils/
│   ├── request.js                # Axios 封装（拦截器）
│   └── common.js                 # 通用工具函数
├── assets/
│   └── global.css                # 全局样式
├── App.vue                       # 根组件
└── main.js                       # 入口文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 环境变量

| 文件 | 用途 |
|------|------|
| `.env` | 公共配置 |
| `.env.development` | 开发环境 |
| `.env.production` | 生产环境 |

主要变量：

```env
VITE_API_BASE_URL=/api
VITE_APP_NAME=Experiment Platform
```

## 用户角色

| 角色 | 说明 |
|------|------|
| **受试者 (subject)** | 参与实验、查看实验记录、领取报酬 |
| **研究者 (researcher)** | 创建实验、管理实验、审核数据 |
| **管理员 (admin)** | 管理用户、审批注册、系统配置 |

## 路由规划

| 路径 | 页面 | 权限 |
|------|------|------|
| `/` | 首页 | 公开 |
| `/login` | 登录 | 公开 |
| `/register` | 注册 | 公开 |
| `/subject` | 受试者端 | subject |
| `/researcher` | 研究者端 | researcher |
| `/admin` | 管理员端 | admin |
| `/experiment-management` | 实验管理 | researcher |
| `/experiment-config` | 实验配置 | researcher |
| `/checkin-management` | 签到管理 | 登录用户 |
| `/payment-management` | 报酬管理 | 登录用户 |
| `/registration-review` | 注册审核 | admin |
| `/review-management` | 审核管理 | admin |
| `/about` | 关于 | 公开 |
| `/:pathMatch(.*)*` | 404 | 公开 |

## API 封装

请求工具位于 `src/utils/request.js`，基于 Axios 封装，包含：

- 请求/响应拦截器
- Token 自动携带
- 统一错误处理

```javascript
import { userApi } from '@/api/index'

// 获取用户列表
userApi.getList({ page: 1, limit: 10 })

// 登录
userApi.login({ username, password, role })
```

## 功能特性

- [x] 用户注册与登录
- [x] 多角色权限管理（受试者/研究者/管理员）
- [x] 实验 CRUD
- [x] 签到管理
- [x] 报酬管理（含 Excel 导出）
- [x] 注册审核
- [x] 二维码生成
- [x] 路由级代码分割

## 代码规范

- ESLint — 配置在 `.eslintrc.cjs`
- Prettier — 配置在 `.prettierrc.json`
- EditorConfig — 配置在 `.editorconfig`

## 许可证

MIT
