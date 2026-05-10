<template>
  <div class="home">
    <!-- Welcome Banner -->
    <div class="welcome-banner animate-in">
      <div class="banner-content">
        <h2>欢迎回来</h2>
        <p>被试招募管理系统为您提供高效的实验管理、数据分析和被试跟踪服务。</p>
      </div>
      <div class="banner-visual">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <rect x="10" y="50" width="24" height="24" rx="6" fill="rgba(255,255,255,0.25)"/>
          <rect x="40" y="38" width="24" height="36" rx="6" fill="rgba(255,255,255,0.35)"/>
          <rect x="70" y="20" width="24" height="54" rx="6" fill="rgba(255,255,255,0.45)"/>
          <circle cx="95" cy="20" r="8" fill="rgba(255,255,255,0.25)"/>
          <circle cx="95" cy="38" r="4" fill="rgba(255,255,255,0.18)"/>
          <path d="M16 6L8 10v4c0 5 3.5 9 8 10 4.5-1 8-5 8-10v-4l-8-4z" fill="rgba(255,255,255,0.5)"/>
        </svg>
      </div>
    </div>

    <!-- Statistics Row -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="stat-card-lab animate-in animate-in-1">
          <div class="stat-icon">
            <el-icon :size="20"><User /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.users }}</div>
          <div class="stat-label">用户总数</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="stat-card-lab animate-in animate-in-2">
          <div class="stat-icon">
            <el-icon :size="20"><Document /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.orders }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="stat-card-lab animate-in animate-in-3">
          <div class="stat-icon">
            <el-icon :size="20"><Money /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.revenue }}</div>
          <div class="stat-label">总收入</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6">
        <div class="stat-card-lab animate-in animate-in-4">
          <div class="stat-icon">
            <el-icon :size="20"><TrendCharts /></el-icon>
          </div>
          <div class="stat-value">{{ statistics.growth }}</div>
          <div class="stat-label">增长率</div>
        </div>
      </el-col>
    </el-row>

    <!-- User Table -->
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户信息</span>
          <el-button type="primary" size="default" @click="loadData">
            <el-icon><Refresh /></el-icon>
            加载数据
          </el-button>
        </div>
      </template>

      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '活跃' ? 'success' : 'info'" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Document, Money, TrendCharts, Refresh } from '@element-plus/icons-vue'

const statistics = ref({
  users: 1024,
  orders: 2048,
  revenue: '¥123,456',
  growth: '+15%'
})

const userList = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: '活跃' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: '活跃' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: '休眠' }
])

const loadData = () => {
  ElMessage.success('数据加载成功')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑用户 ${row.name}`)
}

const handleDelete = (row) => {
  ElMessage.warning(`删除用户 ${row.name}`)
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(105deg, #1a3558 0%, #234b8a 50%, #2a5fb8 100%);
  border-radius: 18px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 36px rgba(26, 53, 88, 0.18);
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: 20%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 50%;
}

.banner-content h2 {
  margin: 0 0 8px 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.banner-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 480px;
}

.banner-visual {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

/* Stats Row */
.stats-row {
  margin: 0 !important;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(44, 92, 197, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px auto;
  color: #2c5cc5;
}

/* Content Card */
.content-card {
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e3b6b;
  letter-spacing: -0.01em;
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .banner-content p {
    max-width: 100%;
  }
}
</style>
