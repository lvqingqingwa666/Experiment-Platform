<template>
  <div class="review-management">
    <!-- Stats Row -->
    <el-row :gutter="20" class="stats-row animate-in">
      <el-col :span="6">
        <div class="stat-mini-card">
          <el-statistic title="平均评分" :value="averageScore" :precision="1">
            <template #suffix>
              <el-rate v-model="averageScore" disabled size="small" />
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-mini-card">
          <el-statistic title="总评价数" :value="totalReviews" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stat-mini-card chart-card">
          <div class="dist-title">评分分布</div>
          <div class="dist-chart">
            <div v-for="i in [5,4,3,2,1]" :key="i" class="dist-bar-row">
              <span class="star-label">{{ i }}星</span>
              <div class="dist-bar-track">
                <div
                  class="dist-bar-fill"
                  :style="{ width: getDistPercentage(i) + '%', background: getBarColor(i) }"
                ></div>
              </div>
              <span class="dist-count">{{ getDistCount(i) }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- Filter -->
    <el-card class="filter-card animate-in animate-in-1">
      <div class="filter-flex">
        <el-radio-group v-model="filterRating" size="small" @change="handleFilter">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="high">好评（4-5星）</el-radio-button>
          <el-radio-button label="low">差评（1-2星）</el-radio-button>
        </el-radio-group>
        <el-select v-model="sortBy" size="small" @change="handleSort" style="width: 150px">
          <el-option label="按时间降序" value="timeDesc" />
          <el-option label="按评分升序" value="rateAsc" />
        </el-select>
      </div>
    </el-card>

    <!-- Review List -->
    <div class="review-list animate-in animate-in-2" v-loading="loading">
      <el-empty v-if="filteredReviews.length === 0" description="暂无评价数据" />
      <el-card
        v-for="item in filteredReviews"
        :key="item.id"
        class="review-item-card"
        shadow="hover"
      >
        <div class="review-header">
          <div class="user-info">
            <el-avatar :size="36" icon="UserFilled" />
            <div class="user-meta">
              <span class="anonymous-id">{{ item.anonymousId }}</span>
              <el-tag size="small" effect="light">{{ item.experimentTitle }}</el-tag>
            </div>
          </div>
          <span class="time">{{ item.createdAt }}</span>
        </div>

        <div class="review-body">
          <div class="rating-row">
            <el-rate v-model="item.score" disabled size="small" />
            <span class="dimension-tag">{{ item.dimension }}</span>
          </div>
          <p class="content">{{ item.content }}</p>
        </div>

        <div class="review-footer" v-if="item.score <= 2">
          <el-button
            type="primary"
            link
            v-if="!item.hasAppealed"
            @click="openAppeal(item)"
          >对此评价发起申诉</el-button>
          <el-tag v-else type="warning" size="small" effect="light">申诉处理中</el-tag>
        </div>
      </el-card>
    </div>

    <!-- Appeal Dialog -->
    <el-dialog v-model="appealDialogVisible" title="发起评价申诉" width="500px">
      <el-alert
        title="申诉须知"
        type="warning"
        description="申诉仅针对恶意差评、与实验无关的评价。管理员将在3个工作日内反馈。"
        show-icon
        :closable="false"
        class="mb-4"
      />
      <el-form :model="appealForm" label-position="top">
        <el-form-item label="申诉理由" required>
          <el-input v-model="appealForm.reason" type="textarea" placeholder="请详细说明该评价为何属于恶意评价或不实评价" :rows="4" />
        </el-form-item>
        <el-form-item label="证据上传">
          <el-upload action="#" list-type="picture-card" :auto-upload="false" :limit="3">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="appealDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAppeal">提交申诉</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const filterRating = ref('all')
const sortBy = ref('timeDesc')
const appealDialogVisible = ref(false)
const selectedReview = ref(null)
const appealForm = ref({ reason: '' })

const reviews = ref([
  { id: 1, anonymousId: 'SUB-2024-05', experimentTitle: '注意瞬盲实验', score: 5, dimension: '流程清晰', content: '实验设计非常科学，指导语很清楚，实验室环境也很好。', createdAt: '2024-05-09 14:20', hasAppealed: false },
  { id: 2, anonymousId: 'SUB-2024-12', experimentTitle: '视觉搜索任务', score: 2, dimension: '实验设备', content: '电脑显示器偶尔闪烁，影响了我的反应时间，希望检查一下硬件。', createdAt: '2024-05-08 10:15', hasAppealed: false },
  { id: 3, anonymousId: 'SUB-2024-08', experimentTitle: '情绪诱发研究', score: 1, dimension: '其他', content: '恶意刷分，完全没有参与实验就乱评价。', createdAt: '2024-05-07 16:40', hasAppealed: true }
])

const averageScore = ref(4.2)
const totalReviews = ref(45)
const distData = { 5: 27, 4: 11, 3: 5, 2: 1, 1: 1 }

const getDistPercentage = (star) => {
  const max = Math.max(...Object.values(distData))
  return Math.round((distData[star] / max) * 100)
}

const getDistCount = (star) => distData[star]

const getBarColor = (star) => {
  const colors = { 5: '#22c55e', 4: '#2c5cc5', 3: '#3b8fa8', 2: '#f59e0b', 1: '#ef4444' }
  return colors[star] || '#8899b8'
}

const filteredReviews = computed(() => {
  let list = [...reviews.value]
  if (filterRating.value === 'high') list = list.filter(r => r.score >= 4)
  if (filterRating.value === 'low') list = list.filter(r => r.score <= 2)
  if (sortBy.value === 'rateAsc') list.sort((a, b) => a.score - b.score)
  else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return list
})

const openAppeal = (review) => { selectedReview.value = review; appealForm.value.reason = ''; appealDialogVisible.value = true }

const submitAppeal = () => {
  if (!appealForm.value.reason) { ElMessage.warning('请填写申诉理由'); return }
  ElMessage.success('申诉已提交，请等待管理员审核')
  selectedReview.value.hasAppealed = true
  appealDialogVisible.value = false
}

const handleFilter = () => {}
const handleSort = () => {}
</script>

<style scoped>
.review-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  margin: 0 !important;
}

.stat-mini-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 20px 24px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 2px 12px rgba(30, 59, 107, 0.04);
  height: 100%;
  margin-bottom: 20px;
}

.stat-mini-card :deep(.el-statistic) {
  text-align: center;
}

.chart-card {
  text-align: left;
}

.dist-title {
  font-size: 13px;
  color: #8899b8;
  margin-bottom: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dist-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dist-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.star-label {
  width: 32px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  font-weight: 500;
}

.dist-bar-track {
  flex: 1;
  height: 14px;
  background: #f1f5f9;
  border-radius: 7px;
  overflow: hidden;
}

.dist-bar-fill {
  height: 100%;
  border-radius: 7px;
  transition: width 0.8s cubic-bezier(0.22, 0.87, 0.36, 1.02);
  min-width: 4px;
}

.dist-count {
  width: 28px;
  font-size: 12px;
  color: #8899b8;
  font-weight: 600;
  text-align: center;
}

/* Filter */
.filter-card { margin: 0; }
.filter-flex { display: flex; justify-content: space-between; align-items: center; }

/* Review List */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-item-card { margin: 0; }
.review-item-card .review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.user-info { display: flex; align-items: center; gap: 12px; }
.user-meta { display: flex; flex-direction: column; gap: 4px; }
.anonymous-id { font-weight: 600; color: #1e3b6b; font-size: 14px; }
.time { font-size: 12px; color: #8899b8; white-space: nowrap; }
.rating-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.dimension-tag {
  font-size: 12px;
  color: #2c5cc5;
  background: rgba(44, 92, 197, 0.07);
  padding: 2px 10px;
  border-radius: 6px;
  font-weight: 500;
}
.content { color: #475569; line-height: 1.7; margin: 0; font-size: 14px; }
.review-footer { border-top: 1px solid #f0f0f0; margin-top: 14px; padding-top: 14px; text-align: right; }

.ml-2 { margin-left: 8px; }
.mb-4 { margin-bottom: 16px; }
</style>
