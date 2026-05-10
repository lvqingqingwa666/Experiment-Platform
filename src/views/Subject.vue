<template>
  <div class="subject-dashboard">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎，被试 {{ store.user.name }}</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </template>

      <el-alert
        title="被试面板"
        description="这里是您的实验参与界面，您可以查看可参与的实验、提交实验结果等。"
        type="info"
        show-icon
        closable
      />

      <el-divider />

      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="可参与实验" :value="stats.availableExperiments" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="已完成实验" :value="stats.completedExperiments" />
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-card shadow="hover" class="stat-card">
            <el-statistic title="获得积分" :value="stats.points" />
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <h3>最新实验</h3>
      <el-table :data="experiments" style="width: 100%">
        <el-table-column prop="title" label="实验名称" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="reward" label="奖励积分" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              v-if="row.status === '可参与'"
              size="small"
              type="primary"
              @click="joinExperiment(row)"
            >
              参与实验
            </el-button>
            <el-button
              v-else-if="row.status === '进行中'"
              size="small"
              @click="continueExperiment(row)"
            >
              继续
            </el-button>
            <span v-else>已完成</span>
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
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

const stats = ref({
  availableExperiments: 5,
  completedExperiments: 12,
  points: 450
})

const experiments = ref([
  {
    id: 1,
    title: '认知测试实验',
    description: '测试您的反应时间和记忆力',
    reward: 50,
    status: '可参与'
  },
  {
    id: 2,
    title: '情绪识别实验',
    description: '通过面部表情识别情绪状态',
    reward: 30,
    status: '进行中'
  },
  {
    id: 3,
    title: '决策实验',
    description: '测试决策能力和风险偏好',
    reward: 40,
    status: '已完成'
  }
])

const getStatusType = (status) => {
  switch (status) {
    case '可参与': return 'success'
    case '进行中': return 'warning'
    case '已完成': return 'info'
    default: return ''
  }
}

const joinExperiment = (experiment) => {
  ElMessageBox.confirm(
    `确定要参与"${experiment.title}"吗？`,
    '确认参与',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    ElMessage.success(`成功参与实验"${experiment.title}"`)
    experiment.status = '进行中'
  })
}

const continueExperiment = (experiment) => {
  ElMessage.info(`继续实验"${experiment.title}"`)
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '退出确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.logout()
    router.push('/login')
    ElMessage.success('已退出登录')
  })
}

onMounted(() => {
  // 检查登录状态
  if (!store.isLoggedIn) {
    router.push('/login')
  }
})
</script>

<style scoped>
.subject-dashboard {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-card {
  text-align: center;
  margin-bottom: 20px;
}
</style>
