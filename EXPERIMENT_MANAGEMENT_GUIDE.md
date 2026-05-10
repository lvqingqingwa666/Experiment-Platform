# 实验管理页面开发指南

## 页面概述

实验管理页面位于 `/experiments` 路由，主要为研究者提供完整的实验管理功能。

## 功能模块

### 1. 搜索栏模块

**位置**: 页面顶部

**包含元素**:
- **实验标题搜索框**: 支持模糊搜索实验标题
- **状态下拉选择**: 包含6种状态
  - DRAFT (草稿)
  - PUBLISHED (已发布)
  - RECRUITING (招募中)
  - FULL (报名已满)
  - ONGOING (进行中)
  - COMPLETED (已完成)
- **时间范围选择器**: 支持选择开始和结束日期
- **搜索按钮**: 执行搜索操作，重置分页为第1页
- **重置按钮**: 清空所有搜索条件
- **创建实验按钮**: 打开创建/编辑对话框

```vue
<el-input v-model="searchForm.title" placeholder="输入实验标题" />
<el-select v-model="searchForm.status" placeholder="选择状态" />
<el-date-picker v-model="searchForm.dateRange" type="daterange" />
```

### 2. 实验列表表格

**列定义**:
| 列名 | 宽度 | 描述 |
|------|------|------|
| ID | 80px | 实验唯一标识符 |
| 实验标题 | 150px | 实验名称 |
| 地点 | 120px | 实验进行地点 |
| 开始时间 | 160px | 实验开始时间，可排序 |
| 状态 | 100px | 用 el-tag 显示，不同状态有不同颜色 |
| 已报名/最大人数 | 140px | 显示进度条和人数统计 |
| 报酬 | 100px | 实验报酬金额，可排序 |
| 操作 | 280px | 编辑、发布、审核报名、签到管理、删除按钮 |

**状态颜色对应**:
```javascript
DRAFT → info (灰色)
PUBLISHED → success (绿色)
RECRUITING → warning (黄色)
FULL → danger (红色)
ONGOING → success (绿色)
COMPLETED → info (灰色)
```

**操作按钮逻辑**:
- **编辑**: 所有状态可用
- **发布**: 仅 DRAFT 状态可用
- **审核报名**: RECRUITING/FULL/ONGOING 状态可用
- **签到管理**: ONGOING/COMPLETED 状态可用
- **删除**: 所有状态可用，需要确认对话框

### 3. 参与者进度条

参与者显示使用进度条表示报名情况：
- 0-79%: 绿色 (success)
- 80-99%: 黄色 (warning)
- 100%+: 红色 (exception)

### 4. 分页组件

**功能**:
- 每页显示数量可选: 10, 20, 50, 100
- 支持跳转到指定页
- 显示总条数

### 5. 创建/编辑对话框

**表单字段**:
```javascript
{
  title: '',          // 实验标题 (必填)
  description: '',    // 实验描述 (必填, 文本框)
  location: '',       // 地点 (必填)
  startTime: null,    // 开始时间 (必填, 日期时间选择器)
  maxParticipants: 30,// 最大人数 (必填, 数字输入)
  compensation: 50    // 报酬 (必填, 数字输入，支持小数)
}
```

## API 接口

### 获取实验列表
```javascript
GET /api/experiments
参数:
- page: 页码
- pageSize: 每页数量
- title: 实验标题 (可选)
- status: 实验状态 (可选)
- startDate: 开始日期 (可选)
- endDate: 结束日期 (可选)

返回:
{
  data: [
    {
      id: 1,
      title: '认知测试',
      location: '实验室A',
      startTime: '2024-06-15 14:00:00',
      status: 'RECRUITING',
      participants: 28,
      maxParticipants: 30,
      compensation: 50,
      description: '...'
    }
  ],
  total: 100
}
```

### 创建实验
```javascript
POST /api/experiments
请求体:
{
  title: '实验标题',
  description: '实验描述',
  location: '地点',
  startTime: '2024-06-15T14:00:00',
  maxParticipants: 30,
  compensation: 50
}
```

### 更新实验
```javascript
PUT /api/experiments/{id}
// 与创建相同的请求体结构
```

### 发布实验
```javascript
POST /api/experiments/{id}/publish
返回: 成功时返回更新后的实验信息
```

### 删除实验
```javascript
DELETE /api/experiments/{id}
```

### 获取报名列表
```javascript
GET /api/experiments/{id}/applications
```

### 获取签到列表
```javascript
GET /api/experiments/{id}/checkins
```

## 数据模型

```javascript
// 实验对象
{
  id: Number,
  title: String,
  description: String,
  location: String,
  startTime: String (ISO 8601),
  status: String (DRAFT|PUBLISHED|RECRUITING|FULL|ONGOING|COMPLETED),
  participants: Number,
  maxParticipants: Number,
  compensation: Number,
  createdBy: Number,
  createdAt: String,
  updatedAt: String
}
```

## 状态流转说明

```
DRAFT → PUBLISHED → RECRUITING → FULL/ONGOING → COMPLETED
  ↓
DELETE (任何状态)
```

**状态说明**:
- **DRAFT**: 草稿状态，可编辑、发布或删除
- **PUBLISHED**: 已发布，等待招募中
- **RECRUITING**: 招募中，接受报名
- **FULL**: 报名已满，不再接受报名
- **ONGOING**: 实验进行中，可进行签到
- **COMPLETED**: 已完成，可查看统计数据

## 组件 Props & Emits

### ExperimentManagement.vue

**属性**:
- 无 Props (独立页面组件)

**主要方法**:
```javascript
loadData()                    // 加载实验列表
handleSearch()               // 执行搜索
handleReset()                // 重置搜索条件
showCreateDialog()           // 显示创建对话框
handleEdit(row)              // 编辑实验
handlePublish(row)           // 发布实验
handleReviewApplications(row)// 审核报名
handleCheckIn(row)           // 签到管理
handleDelete(row)            // 删除实验
handleSaveExperiment()       // 保存实验
```

## 样式说明

- 响应式布局，适配移动端
- 搜索栏在移动端自动换行
- 表格启用了水平滚动和固定操作列
- 分页组件位于表格下方，右对齐

## 扩展建议

- [ ] 添加批量删除功能
- [ ] 添加实验模板功能
- [ ] 添加报告导出功能
- [ ] 添加参与者数据分析
- [ ] 实现权限控制（只能管理自己的实验）
- [ ] 添加实验复制功能
- [ ] 实现实时通知（新报名、系统消息）
- [ ] 添加报名条件设置
- [ ] 支持实验分类/标签
- [ ] 实现参与者黑名单功能
