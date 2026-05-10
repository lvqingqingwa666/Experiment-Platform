<template>
  <div class="researcher-dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner animate-in">
      <div class="banner-content">
        <h2>你好，{{ store.user.name }}</h2>
        <p>欢迎回到研究者工作台，以下是您的实验概览数据。</p>
      </div>
      <div class="banner-visual">
        <svg width="100" height="72" viewBox="0 0 100 72" fill="none">
          <rect x="12" y="44" width="18" height="22" rx="5" fill="rgba(255,255,255,0.2)"/>
          <rect x="36" y="32" width="18" height="34" rx="5" fill="rgba(255,255,255,0.3)"/>
          <rect x="60" y="18" width="18" height="48" rx="5" fill="rgba(255,255,255,0.4)"/>
          <circle cx="16" cy="16" r="8" fill="rgba(255,255,255,0.2)"/>
          <line x1="24" y1="26" x2="36" y2="26" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
          <line x1="24" y1="34" x2="36" y2="34" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Stats Row -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="12" :md="8">
        <div class="stat-card-lab animate-in animate-in-1">
          <div class="stat-icon running">
            <el-icon :size="18"><VideoPlay /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.runningExperiments }}</div>
            <div class="stat-label">进行中实验</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8">
        <div class="stat-card-lab animate-in animate-in-2">
          <div class="stat-icon completed">
            <el-icon :size="18"><CircleCheck /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.completedExperiments }}</div>
            <div class="stat-label">已完成实验</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8">
        <div class="stat-card-lab animate-in animate-in-3">
          <div class="stat-icon subjects">
            <el-icon :size="18"><User /></el-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.totalSubjects }}</div>
            <div class="stat-label">总被试数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Actions Bar -->
    <div class="actions-bar animate-in animate-in-2">
      <el-button type="primary" @click="goToExperimentManagement">
        <el-icon><Management /></el-icon>
        管理实验
      </el-button>
      <el-button plain @click="viewResults">
        <el-icon><DataAnalysis /></el-icon>
        查看结果
      </el-button>
    </div>

    <!-- My Experiments Table -->
    <el-card class="content-card animate-in animate-in-3">
      <template #header>
        <span class="card-title">我的实验</span>
      </template>

      <el-table :data="experiments" style="width: 100%">
        <el-table-column prop="title" label="实验名称" min-width="160">
          <template #default="{ row }">
            <span class="experiment-title">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="180" />
        <el-table-column prop="participants" label="参与人数" width="100" align="center" />
        <el-table-column prop="duration" label="时长" width="90" align="center">
          <template #default="{ row }">{{ row.duration }}min</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editExperiment(row)">编辑</el-button>
            <el-button size="small" plain @click="viewData(row)">数据</el-button>
            <el-button
              v-if="row.status === '进行中'"
              size="small"
              plain
              type="warning"
              @click="stopExperiment(row)"
            >停止</el-button>
            <el-button
              v-else-if="row.status === '草稿'"
              size="small"
              type="primary"
              @click="publishExperiment(row)"
            >发布</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { VideoPlay, CircleCheck, User, Management, DataAnalysis } from '@element-plus/icons-vue'
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

const stats = ref({
  runningExperiments: 3,
  completedExperiments: 8,
  totalSubjects: 156
})

const experiments = ref([
  { id: 1, title: '认知测试实验', description: '测试反应时间和记忆力', participants: 45, status: '进行中', createdAt: '2024-01-15', duration: 60 },
  { id: 2, title: '情绪识别研究', description: '面部表情情绪识别实验', participants: 32, status: '已完成', createdAt: '2024-01-10', duration: 90 },
  { id: 3, title: '决策行为研究', description: '风险决策行为分析', participants: 0, status: '草稿', createdAt: '2024-01-20', duration: 45 }
])

const getStatusType = (status) => {
  switch (status) {
    case '进行中': return 'primary'
    case '已完成': return 'success'
    case '草稿': return 'info'
    default: return ''
  }
}

const goToExperimentManagement = () => router.push('/experiments')
const viewResults = () => ElMessage.info('查看结果功能开发中...')
const editExperiment = (experiment) => router.push(`/experiments/config/${experiment.id}`)
const viewData = (experiment) => ElMessage.info(`查看实验"${experiment.title}"的数据`)

const stopExperiment = (experiment) => {
  ElMessageBox.confirm(
    `确定要停止实验"${experiment.title}"吗？`,
    '停止确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success(`实验"${experiment.title}"已停止`)
    experiment.status = '已完成'
  })
}

const publishExperiment = (experiment) => {
  ElMessageBox.confirm(
    `确定要发布实验"${experiment.title}"吗？`,
    '发布确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
  ).then(() => {
    ElMessage.success(`实验"${experiment.title}"已发布`)
    experiment.status = '进行中'
  })
}

onMounted(() => {
  if (!store.isLoggedIn) router.push('/login')
})
</script>

<style scoped>
.researcher-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(105deg, #1a3558 0%, #234b8a 50%, #2a5fb8 100%);
  border-radius: 18px;
  padding: 28px 32px;
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
  top: -40%;
  right: -8%;
  width: 240px;
  height: 240px;
  background: rgba(255, 255, 255, 0.025);
  border-radius: 50%;
}

.banner-content h2 {
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.banner-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 400px;
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

.stat-card-lab {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 2px 12px rgba(30, 59, 107, 0.04);
  transition: all 0.3s cubic-bezier(0.45, 0, 0.25, 1);
  cursor: default;
  margin-bottom: 20px;
}

.stat-card-lab:hover {
  box-shadow: 0 8px 28px rgba(30, 59, 107, 0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.running { background: rgba(44, 92, 197, 0.1); color: #2c5cc5; }
.stat-icon.completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stat-icon.subjects { background: rgba(59, 143, 168, 0.1); color: #3b8fa8; }

.stat-body {
  min-width: 0;
}

.stat-card-lab .stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1a3558;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.stat-card-lab .stat-label {
  font-size: 12px;
  color: #8899b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

/* Actions Bar */
.actions-bar {
  display: flex;
  gap: 12px;
}

.actions-bar .el-button--primary {
  border-radius: 10px !important;
  font-weight: 600;
}

.actions-bar .el-button:not(.el-button--primary) {
  border-radius: 10px !important;
}

/* Content Card */
.content-card {
  margin: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a3558;
}

.experiment-title {
  font-weight: 600;
  color: #1e3b6b;
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  .banner-content p {
    max-width: 100%;
  }
  .banner-visual {
    display: none;
  }
}
</style>
