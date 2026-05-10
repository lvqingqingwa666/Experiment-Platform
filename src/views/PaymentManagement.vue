<template>
  <div class="payment-management">
    <el-card class="content-card animate-in">
      <template #header>
        <div class="card-header-bar">
          <span class="card-title">支付确认管理</span>
          <el-radio-group v-model="filterStatus" size="small" @change="loadData">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="PENDING">待支付</el-radio-button>
            <el-radio-button label="PAID">已支付</el-radio-button>
            <el-radio-button label="DISPUTED">争议中</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="anonymousId" label="匿名ID" width="120" />
        <el-table-column prop="experimentTitle" label="实验标题" min-width="150">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.experimentTitle }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="报酬金额" width="110" align="center">
          <template #default="{ row }">¥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="status" label="支付状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="light" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payerTime" label="研究者确认" width="170">
          <template #default="{ row }">{{ row.payerTime || '—' }}</template>
        </el-table-column>
        <el-table-column prop="subjectTime" label="被试确认" width="170">
          <template #default="{ row }">{{ row.subjectTime || '—' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              v-if="row.status === 'PENDING'"
              @click="openPayDialog(row)"
            >标记已支付</el-button>
            <el-button
              size="small"
              plain
              type="warning"
              v-if="row.status === 'DISPUTED'"
              @click="openDisputeDialog(row)"
            >查看争议</el-button>
            <el-button size="small" link v-if="row.screenshot" @click="viewScreenshot(row)">查看截图</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Pay Dialog -->
    <el-dialog v-model="payDialogVisible" title="确认支付" width="460px">
      <el-form :model="payForm" label-position="top">
        <el-form-item label="支付截图存证（必填）">
          <el-upload class="screenshot-uploader" action="#" :auto-upload="false" :limit="1" drag>
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">拖拽图片或 <em>点击上传</em></div>
          </el-upload>
        </el-form-item>
        <p class="tip">请确保截图包含：付款方、收款匿名ID及金额。</p>
      </el-form>
      <template #footer>
        <el-button @click="payDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPayment">确认已支付</el-button>
      </template>
    </el-dialog>

    <!-- Dispute Dialog -->
    <el-dialog v-model="disputeDialogVisible" title="争议处理" width="550px">
      <div v-if="selectedRow" class="dispute-content">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="争议原因">{{ selectedRow.disputeReason }}</el-descriptions-item>
          <el-descriptions-item label="被试上传证据">
            <el-image style="width: 100px; height: 100px" :src="selectedRow.subjectEvidence" :preview-src-list="[selectedRow.subjectEvidence]" fit="cover" />
          </el-descriptions-item>
        </el-descriptions>
        <el-form class="mt-4" label-position="top">
          <el-form-item label="审核处理意见">
            <el-input v-model="adminOpinion" type="textarea" placeholder="请填写处理理由" :rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="danger" @click="handleDispute('REJECT')">维持原判（拒绝）</el-button>
        <el-button type="success" @click="handleDispute('APPROVE')">重新转账（通过）</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const loading = ref(false)
const filterStatus = ref('')
const tableData = ref([])
const payDialogVisible = ref(false)
const disputeDialogVisible = ref(false)
const selectedRow = ref(null)
const adminOpinion = ref('')
const payForm = ref({ screenshot: null })

const mockRecords = [
  { id: 1, anonymousId: 'SUB-982', experimentTitle: '注意偏向实验', amount: 50.00, status: 'PENDING', payerTime: null, subjectTime: null, screenshot: null },
  { id: 2, anonymousId: 'SUB-411', experimentTitle: '视觉搜索任务', amount: 35.00, status: 'DISPUTED', payerTime: '2024-05-08 14:00', subjectTime: null, disputeReason: '研究者标记已支付，但我实际未收到账款', subjectEvidence: 'https://via.placeholder.com/150', screenshot: 'https://via.placeholder.com/150' },
  { id: 3, anonymousId: 'SUB-102', experimentTitle: '决策博弈实验', amount: 80.00, status: 'CONFIRMED', payerTime: '2024-05-07 10:00', subjectTime: '2024-05-07 15:30', screenshot: 'https://via.placeholder.com/150' }
]

const loadData = () => {
  loading.value = true
  setTimeout(() => {
    tableData.value = filterStatus.value ? mockRecords.filter(r => r.status === filterStatus.value) : mockRecords
    loading.value = false
  }, 400)
}

const openPayDialog = (row) => { selectedRow.value = row; payDialogVisible.value = true }

const confirmPayment = () => {
  ElMessage.success('支付状态已更新，等待被试确认')
  selectedRow.value.status = 'PAID'
  selectedRow.value.payerTime = new Date().toLocaleString()
  payDialogVisible.value = false
}

const openDisputeDialog = (row) => { selectedRow.value = row; adminOpinion.value = ''; disputeDialogVisible.value = true }

const handleDispute = (action) => {
  if (!adminOpinion.value) { ElMessage.warning('请填写处理意见'); return }
  const msg = action === 'APPROVE' ? '争议已解决：将安排重新转账' : '争议已驳回：维持原支付结果'
  ElMessage.success(msg)
  selectedRow.value.status = action === 'APPROVE' ? 'PENDING' : 'CONFIRMED'
  disputeDialogVisible.value = false
}

const getStatusType = (s) => ({ PENDING: 'info', PAID: 'primary', CONFIRMED: 'success', DISPUTED: 'danger' })[s] || ''
const getStatusText = (s) => ({ PENDING: '待支付', PAID: '已支付', CONFIRMED: '已确认', DISPUTED: '争议中' })[s] || s
const viewScreenshot = (row) => window.open(row.screenshot)

onMounted(loadData)
</script>

<style scoped>
.payment-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-card {
  margin: 0;
}

.card-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a3558;
}

.tip {
  color: #8899b8;
  font-size: 12px;
  margin-top: 10px;
}

.mt-4 { margin-top: 16px; }

.screenshot-uploader :deep(.el-upload-dragger) { padding: 20px; }
</style>
