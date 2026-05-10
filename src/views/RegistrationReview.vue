<template>
  <div class="registration-review">
    <el-page-header @back="goBack" class="review-header">
      <template #content>
        <span class="header-title">报名审核 · {{ experimentTitle }}</span>
      </template>
    </el-page-header>

    <el-card class="table-card animate-in">
      <el-table :data="registrations" style="width: 100%" v-loading="loading" stripe>
        <el-table-column prop="anonymousId" label="匿名ID" width="140">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)" :underline="false">{{ row.anonymousId }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="ageGroup" label="年龄段" width="100" align="center" />
        <el-table-column prop="gender" label="性别" width="80" align="center" />
        <el-table-column prop="major" label="专业" min-width="130" />
        <el-table-column prop="appliedAt" label="报名时间" width="180" />
        <el-table-column prop="status" label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">详情</el-button>
            <el-button
              size="small"
              type="primary"
              plain
              v-if="row.status === 'PENDING'"
              @click="handleApprove(row)"
            >通过</el-button>
            <el-button
              size="small"
              plain
              type="danger"
              v-if="row.status === 'PENDING'"
              @click="showRejectDialog(row)"
            >拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="报名详情审核" width="600px">
      <div v-if="selectedUser" class="profile-detail">
        <el-descriptions title="被试档案（脱敏）" :column="2" border size="small">
          <el-descriptions-item label="匿名ID">{{ selectedUser.anonymousId }}</el-descriptions-item>
          <el-descriptions-item label="报名时间">{{ selectedUser.appliedAt }}</el-descriptions-item>
          <el-descriptions-item label="年龄段">{{ selectedUser.ageGroup }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ selectedUser.gender }}</el-descriptions-item>
          <el-descriptions-item label="专业类别">{{ selectedUser.major }}</el-descriptions-item>
          <el-descriptions-item label="利手">{{ selectedUser.handedness }}</el-descriptions-item>
        </el-descriptions>

        <h4 class="check-title">筛选条件匹配结果</h4>
        <div class="check-list">
          <div v-for="item in selectedUser.checkResults" :key="item.label" class="check-item">
            <span>{{ item.label }}</span>
            <el-icon :color="item.matched ? '#22c55e' : '#ef4444'" :size="20">
              <CircleCheckFilled v-if="item.matched" />
              <CircleCloseFilled v-else />
            </el-icon>
          </div>
        </div>

        <div v-if="isRejecting" class="mt-4">
          <el-input
            v-model="rejectReason"
            type="textarea"
            placeholder="请输入拒绝原因，这将发送给被试"
            :rows="3"
          />
        </div>
      </div>
      <template #footer>
        <template v-if="selectedUser?.status === 'PENDING'">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="!isRejecting" plain type="danger" @click="isRejecting = true">拒绝申请</el-button>
          <el-button v-if="isRejecting" type="danger" @click="confirmReject">确认拒绝</el-button>
          <el-button type="primary" @click="confirmApprove">通过审核</el-button>
        </template>
        <template v-else>
          <el-button @click="dialogVisible = false">关闭</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, CircleCloseFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const experimentTitle = ref('视觉感知与决策研究')
const registrations = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const selectedUser = ref(null)
const isRejecting = ref(false)
const rejectReason = ref('')

const mockData = [
  {
    id: 1, anonymousId: 'SUB-2024-001', ageGroup: '18-25', gender: '男', major: '计算机科学',
    handedness: '右', appliedAt: '2024-05-09 10:30:00', status: 'PENDING',
    checkResults: [
      { label: '年龄符合 (18-35岁)', matched: true },
      { label: '无精神疾病史', matched: true },
      { label: '视力正常或矫正正常', matched: true }
    ]
  },
  {
    id: 2, anonymousId: 'SUB-2024-002', ageGroup: '26-30', gender: '女', major: '心理学',
    handedness: '左', appliedAt: '2024-05-09 11:15:00', status: 'PENDING',
    checkResults: [
      { label: '年龄符合 (18-35岁)', matched: true },
      { label: '无精神疾病史', matched: true },
      { label: '视力正常或矫正正常', matched: false }
    ]
  },
  {
    id: 3, anonymousId: 'SUB-2024-003', ageGroup: '18-25', gender: '女', major: '医学',
    handedness: '右', appliedAt: '2024-05-08 16:20:00', status: 'APPROVED',
    checkResults: [
      { label: '年龄符合 (18-35岁)', matched: true },
      { label: '无精神疾病史', matched: true },
      { label: '视力正常或矫正正常', matched: true }
    ]
  }
]

const loadData = () => {
  loading.value = true
  setTimeout(() => { registrations.value = [...mockData]; loading.value = false }, 400)
}

const viewDetail = (row) => { selectedUser.value = row; isRejecting.value = false; rejectReason.value = ''; dialogVisible.value = true }
const handleApprove = (row) => { selectedUser.value = row; confirmApprove() }

const confirmApprove = () => {
  ElMessage.success(`审核已通过！已向 ${selectedUser.value.anonymousId} 发送通知邮件。`)
  selectedUser.value.status = 'APPROVED'; dialogVisible.value = false
}

const showRejectDialog = (row) => { viewDetail(row); isRejecting.value = true }

const confirmReject = () => {
  if (!rejectReason.value) { ElMessage.warning('请填写拒绝原因'); return }
  ElMessage.success(`已拒绝 ${selectedUser.value.anonymousId} 的申请。`)
  selectedUser.value.status = 'REJECTED'; dialogVisible.value = false
}

const getStatusType = (status) => ({ PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' })[status] || 'info'
const getStatusText = (status) => ({ PENDING: '待审核', APPROVED: '已通过', REJECTED: '已拒绝' })[status] || status
const goBack = () => router.push('/experiments')

onMounted(loadData)
</script>

<style scoped>
.registration-review {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 16px 24px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 2px 12px rgba(30, 59, 107, 0.04);
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a3558;
}

.table-card {
  margin: 0;
}

.check-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a3558;
  margin: 20px 0 12px 0;
}

.check-list {
  background: #f8faff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(210, 221, 239, 0.4);
}

.check-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  color: #475569;
}

.check-item:last-child { border-bottom: none; }

.mt-4 { margin-top: 16px; }
</style>
