<template>
  <div class="experiment-management">
    <!-- Search Bar -->
    <el-card class="search-card animate-in">
      <el-form>
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="实验标题">
              <el-input
                v-model="searchTitle"
                placeholder="输入实验标题"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="状态">
              <el-select
                v-model="searchStatus"
                placeholder="选择状态"
                clearable
                style="width: 100%"
              >
                <el-option label="草稿" value="DRAFT" />
                <el-option label="待审核" value="PENDING_REVIEW" />
                <el-option label="已发布" value="PUBLISHED" />
                <el-option label="招募中" value="RECRUITING" />
                <el-option label="报名已满" value="FULL" />
                <el-option label="进行中" value="ONGOING" />
                <el-option label="已完成" value="COMPLETED" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="searchDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <div class="btn-group">
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>搜索
              </el-button>
              <el-button plain @click="handleReset">
                <el-icon><RefreshRight /></el-icon>重置
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- Table Card -->
    <el-card class="table-card animate-in animate-in-1">
      <template #header>
        <div class="table-header">
          <span class="card-title">实验列表</span>
          <el-button type="primary" @click="router.push('/experiments/config')">
            <el-icon><Plus /></el-icon>创建实验
          </el-button>
        </div>
      </template>

      <div class="table-wrapper">
        <el-table
          :data="tableData"
          :loading="loading"
          :default-sort="{ prop: 'startTime', order: 'descending' }"
          stripe
          border
        >
          <el-table-column prop="id" label="ID" width="55" sortable align="center" />
          <el-table-column prop="title" label="实验标题" min-width="120">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="router.push(`/experiments/config/${row.id}`)">
                {{ row.title }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="地点" width="120" />
          <el-table-column prop="startTime" label="开始时间" width="150" />
          <el-table-column prop="duration" label="时长" width="70" align="center">
            <template #default="{ row }">{{ row.duration }}min</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="85" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" effect="light" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="报名" width="150" align="center">
            <template #default="{ row }">
              <div class="progress-cell">
                <el-progress
                  :percentage="getParticipantPercentage(row)"
                  :stroke-width="5"
                  :status="getProgressStatus(row)"
                  :color="getProgressColor(row)"
                  :show-text="false"
                />
                <span class="progress-text">{{ row.participants }}/{{ row.maxParticipants }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="compensation" label="报酬" width="70" align="center">
            <template #default="{ row }">¥{{ row.compensation }}</template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <div class="action-btns">
                <el-button size="small" @click="router.push(`/experiments/config/${row.id}`)">编辑</el-button>
                <el-button v-if="row.status === 'DRAFT'" size="small" type="primary" @click="handlePublish(row)">发布</el-button>
                <el-button v-if="['RECRUITING', 'FULL', 'ONGOING'].includes(row.status)" size="small" @click="handleReviewApplications(row)">审核</el-button>
                <el-button v-if="['ONGOING', 'COMPLETED'].includes(row.status)" size="small" type="warning" @click="handleCheckIn(row)">签到</el-button>
                <el-button v-if="row.status === 'COMPLETED'" size="small" @click="openEvalDialog(row)">评价</el-button>
                <el-button size="small" type="danger" plain @click="handleDelete(row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="loadData"
          @current-change="loadData"
        />
      </div>
    </el-card>

    <!-- Eval Dialog -->
    <el-dialog v-model="evalDialogVisible" title="批量评价被试" width="650px">
      <el-alert title="请对参与实验的被试进行信用评价，这将影响他们后续接单。" type="info" show-icon class="mb-4" />
      <el-table :data="subjectList" border size="small">
        <el-table-column prop="id" label="匿名ID" width="100" />
        <el-table-column label="配合度评分" width="160">
          <template #default="{ row }">
            <el-rate v-model="row.rate" />
          </template>
        </el-table-column>
        <el-table-column label="评语">
          <template #default="{ row }">
            <el-input v-model="row.comment" placeholder="选填（如迟到、态度等）" size="small"/>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="evalDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEval">提交评价</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'

const router = useRouter()

const loading = ref(false)
const searchTitle = ref('')
const searchStatus = ref('')
const searchDateRange = ref([])
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 5 })
const tableData = ref([])

const mockData = [
  { id: 1, title: '认知能力测试', location: '心理学实验室A', startTime: '2024-06-15 14:00', status: 'RECRUITING', participants: 28, maxParticipants: 30, compensation: 50, duration: 60 },
  { id: 2, title: '情绪识别研究', location: '多媒体教室', startTime: '2024-06-18 10:00', status: 'FULL', participants: 40, maxParticipants: 40, compensation: 75, duration: 90 },
  { id: 3, title: '决策行为研究', location: '实验室B', startTime: '2024-06-20 15:30', status: 'DRAFT', participants: 0, maxParticipants: 20, compensation: 60, duration: 45 },
  { id: 4, title: '社交互动实验', location: '会议室', startTime: '2024-06-10 09:00', status: 'PENDING_REVIEW', participants: 15, maxParticipants: 35, compensation: 100, duration: 120 },
  { id: 5, title: '视觉感知研究', location: '实验室C', startTime: '2024-05-30 11:00', status: 'COMPLETED', participants: 30, maxParticipants: 30, compensation: 55, duration: 75 }
]

const filteredData = computed(() => {
  let list = [...mockData]

  if (searchTitle.value) {
    list = list.filter(r => r.title.includes(searchTitle.value))
  }

  if (searchStatus.value) {
    list = list.filter(r => r.status === searchStatus.value)
  }

  if (searchDateRange.value && searchDateRange.value.length === 2) {
    const [start, end] = searchDateRange.value
    const startTs = new Date(start).getTime()
    const endTs = new Date(end).setHours(23, 59, 59, 999)
    list = list.filter(r => {
      const t = new Date(r.startTime).getTime()
      return t >= startTs && t <= endTs
    })
  }

  return list
})

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = filteredData.value
    pagination.total = tableData.value.length
    pagination.currentPage = 1
    loading.value = false
  }, 300)
}

const handleReviewApplications = (row) => router.push(`/experiments/review/${row.id}`)
const handleCheckIn = (row) => router.push(`/experiments/checkin/${row.id}`)
const handlePublish = (row) => { row.status = 'PENDING_REVIEW'; ElMessage.success('实验已提交待审核') }
const handleDelete = (row) => ElMessage.success(`实验 ${row.title} 已删除`)
const handleSearch = () => {
  if (!searchTitle.value && !searchStatus.value && (!searchDateRange.value || searchDateRange.value.length === 0)) {
    ElMessage.warning('请至少填写一个筛选条件')
    return
  }
  loadData()
}
const handleReset = () => { searchTitle.value = ''; searchStatus.value = ''; searchDateRange.value = []; loadData() }

const evalDialogVisible = ref(false)
const subjectList = ref([])

const openEvalDialog = () => {
  subjectList.value = [
    { id: 'SUB-001', rate: 5, comment: '非常准时配合' },
    { id: 'SUB-002', rate: 4, comment: '' },
    { id: 'SUB-003', rate: 2, comment: '迟到半小时' }
  ]
  evalDialogVisible.value = true
}

const submitEval = () => { ElMessage.success('评价提交成功'); evalDialogVisible.value = false }

const getStatusType = (s) => {
  const map = { DRAFT: 'info', PENDING_REVIEW: 'warning', PUBLISHED: 'success', RECRUITING: '', FULL: 'danger', ONGOING: 'success', COMPLETED: 'info' }
  return map[s] || ''
}
const getStatusText = (s) => {
  const map = { DRAFT: '草稿', PENDING_REVIEW: '待审核', PUBLISHED: '已发布', RECRUITING: '招募中', FULL: '报名已满', ONGOING: '进行中', COMPLETED: '已完成' }
  return map[s] || s
}
const getParticipantPercentage = (row) => Math.min(Math.round((row.participants / row.maxParticipants) * 100), 100)
const getProgressStatus = (row) => getParticipantPercentage(row) >= 100 ? 'exception' : 'success'
const getProgressColor = (row) => getParticipantPercentage(row) >= 100 ? '#F56C6C' : '#2c5cc5'

onMounted(loadData)
</script>

<style scoped>
.experiment-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-card {
  margin: 0;
}

.search-card :deep(.el-form-item) {
  margin-bottom: 0;
}

.btn-group {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.table-card {
  margin: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a3558;
}

.table-wrapper {
  overflow-x: auto;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.progress-cell .el-progress {
  flex: 1;
  min-width: 40px;
}

.progress-text {
  font-size: 11px;
  color: #8899b8;
  white-space: nowrap;
}

.action-btns {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-btns .el-button {
  padding: 5px 12px;
  font-size: 13px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
