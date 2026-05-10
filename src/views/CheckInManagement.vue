<template>
  <div class="checkin-container">
    <el-page-header @back="router.back()" title="现场签到管理" class="checkin-header">
      <template #extra>
        <el-button type="primary" :disabled="!isAllCheckedIn" @click="handleComplete">
          标记实验完成并触发支付
        </el-button>
      </template>
    </el-page-header>

    <el-row :gutter="20" class="mt-4 animate-in">
      <el-col :span="8">
        <el-card class="qr-card">
          <template #header><span class="card-section-title">签到二维码</span></template>
          <div class="qr-wrapper">
            <qrcode-vue :value="qrCodeValue" :size="200" level="H" />
            <div class="qr-info">
              <p>实验ID: {{ experimentId }}</p>
              <el-button type="primary" link @click="refreshQR">
                <el-icon><Refresh /></el-icon> 刷新二维码
              </el-button>
            </div>
          </div>

          <el-divider>手动补签</el-divider>
          <el-form :model="manualForm" @submit.prevent>
            <el-form-item>
              <el-input v-model="manualForm.id" placeholder="输入匿名ID或手机号" @keyup.enter="handleManualCheckIn">
                <template #append>
                  <el-button @click="handleManualCheckIn">补签</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-row :gutter="12" class="mb-4">
          <el-col :span="6" v-for="stat in statCards" :key="stat.label">
            <div class="stat-mini">
              <el-statistic :title="stat.label" :value="stat.value" />
            </div>
          </el-col>
        </el-row>

        <el-card>
          <template #header>
            <div class="table-header">
              <span class="card-section-title">签到记录</span>
              <el-button size="small" plain @click="exportExcel">导出Excel</el-button>
            </div>
          </template>

          <el-table :data="records" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="anonymousId" label="匿名ID" width="120" />
            <el-table-column prop="checkInTime" label="签到时间" width="180">
              <template #default="{ row }">{{ row.checkInTime || '—' }}</template>
            </el-table-column>
            <el-table-column prop="method" label="方式" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.method" :type="getMethodType(row.method)" effect="light" size="small">
                  {{ row.method }}
                </el-tag>
                <span v-else class="not-checked">未签到</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import * as XLSX from 'xlsx'

const route = useRoute()
const router = useRouter()
const experimentId = route.params.id
const loading = ref(false)

const qrToken = ref('TK' + Math.random().toString(36).substr(2, 9))
const qrCodeValue = computed(() => `EXP:${experimentId}|TOKEN:${qrToken.value}`)

const manualForm = reactive({ id: '' })
const records = ref([
  { anonymousId: 'SUB-001', checkInTime: '2024-05-10 09:05', method: '扫码' },
  { anonymousId: 'SUB-002', checkInTime: '2024-05-10 09:12', method: '手动' },
  { anonymousId: 'SUB-003', checkInTime: null, method: null }
])

const statCards = computed(() => [
  { label: '应到人数', value: 3 },
  { label: '已签到', value: 2 },
  { label: '签到率', value: '66.7%' },
  { label: '未到人数', value: 1 }
])

const isAllCheckedIn = computed(() => records.value.every(r => r.method !== null))

let timer = null
const startPolling = () => { timer = setInterval(() => { console.log('正在实时同步签到状态...') }, 5000) }

const refreshQR = () => { qrToken.value = 'TK' + Math.random().toString(36).substr(2, 9); ElMessage.info('二维码已更新') }

const handleManualCheckIn = () => {
  if (!manualForm.id) return
  const user = records.value.find(r => r.anonymousId === manualForm.id)
  if (user) { user.checkInTime = new Date().toLocaleString(); user.method = '手动'; ElMessage.success('手动签到成功'); manualForm.id = '' }
  else ElMessage.error('该ID不在报名名单中')
}

const handleComplete = () => {
  ElMessageBox.confirm('标记完成后将锁定名单并进入报酬发放流程，是否继续？', '完成实验', {
    confirmButtonText: '确定', type: 'warning'
  }).then(() => { ElMessage.success('实验已完成，请前往支付确认页面'); router.push('/payments') })
}

const exportExcel = () => {
  const ws = XLSX.utils.json_to_sheet(records.value)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "签到记录")
  XLSX.writeFile(wb, `实验_${experimentId}_签到记录.xlsx`)
}

const getMethodType = (m) => m === '手动' ? 'warning' : 'primary'

onMounted(startPolling)
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.checkin-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkin-header {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 16px 24px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 2px 12px rgba(30, 59, 107, 0.04);
}

.card-section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a3558;
}

.qr-card { text-align: center; }
.qr-wrapper { padding: 20px 0; }
.qr-info { margin-top: 15px; color: #666; font-size: 14px; }

.stat-mini {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 20px 16px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 2px 12px rgba(30, 59, 107, 0.04);
  text-align: center;
}

.table-header { display: flex; justify-content: space-between; align-items: center; }

.not-checked { color: #c0c8d4; font-size: 13px; }

.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
</style>
