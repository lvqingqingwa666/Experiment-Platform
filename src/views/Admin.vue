<template>
  <div class="admin-dashboard">
    <!-- Header Banner -->
    <div class="admin-banner animate-in">
      <div class="banner-left">
        <h2>系统管理中心</h2>
        <el-tag type="danger" effect="dark" size="small">超级管理员</el-tag>
      </div>
    </div>

    <!-- Tabs Card -->
    <el-card class="main-card animate-in animate-in-1">
      <el-tabs v-model="activeTab" class="admin-tabs">
        <!-- Tab 1: User Management -->
        <el-tab-pane label="用户管理" name="users">
          <el-table :data="users" stripe>
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="role" label="角色" width="130" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.role === 'admin' ? 'danger' : (row.role === 'researcher' ? 'primary' : 'success')"
                  effect="light"
                  size="small"
                >
                  {{ row.role === 'admin' ? '管理员' : (row.role === 'researcher' ? '研究者' : '被试') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="{ row }">
                <el-switch
                  v-model="row.status"
                  active-value="active"
                  inactive-value="disabled"
                  @change="toggleStatus(row)"
                  size="small"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template #default>
                <el-button size="small" type="primary" link>重置密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Tab 2: Ethics Review -->
        <el-tab-pane label="伦理审查" name="ethics">
          <div class="tab-subtitle">待审核实验 · {{ pendingExperiments.length }} 项</div>
          <el-table :data="pendingExperiments" border>
            <el-table-column prop="title" label="实验名称" min-width="150">
              <template #default="{ row }">
              <span>{{ row.title }}</span>
            </template>
            </el-table-column>
            <el-table-column prop="researcher" label="申请人" width="100" />
            <el-table-column prop="ethicsNo" label="伦理审批号" width="150" />
            <el-table-column prop="riskLevel" label="风险等级" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.riskLevel === '高' ? 'danger' : 'success'" effect="light" size="small">
                  {{ row.riskLevel }}风险
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
              <template #default="{ row }">
                <el-button size="small" plain>查看知情同意书</el-button>
                <el-button size="small" type="primary" plain @click="approveEthics(row)">通过</el-button>
                <el-button size="small" plain type="danger" @click="rejectEthics(row)">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Tab 3: Dispute Center -->
        <el-tab-pane label="争议申诉" name="disputes">
          <div class="tab-subtitle">待处理争议 · {{ disputes.length }} 项</div>
          <el-table :data="disputes" stripe>
            <el-table-column prop="id" label="申诉单号" width="120" />
            <el-table-column prop="type" label="争议类型" width="110" align="center">
              <template #default="{ row }">
                <el-tag :type="row.type === '支付争议' ? 'danger' : 'warning'" effect="light" size="small">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="plaintiff" label="发起方" width="140" />
            <el-table-column prop="defendant" label="被诉方" width="140" />
            <el-table-column prop="reason" label="申诉理由" min-width="200" />
            <el-table-column label="操作" width="120" fixed="right" align="center">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="openDisputeHandle(row)">介入仲裁</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Tab 4: System Config -->
        <el-tab-pane label="系统配置" name="settings">
          <el-form label-width="160px" class="settings-form">
            <el-form-item label="允许被试自由注册">
              <el-switch v-model="settings.allowReg" />
            </el-form-item>
            <el-form-item label="默认冷却期（天）">
              <el-input-number v-model="settings.cooldown" :min="0" />
            </el-form-item>
            <el-form-item label="平台抽成比例（%）">
              <el-input-number v-model="settings.fee" :min="0" :max="100" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">保存全局配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- Dispute Dialog -->
    <el-dialog v-model="disputeDialog" title="仲裁争议" width="520px">
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="单号">{{ activeDispute?.id }}</el-descriptions-item>
        <el-descriptions-item label="双方说明">{{ activeDispute?.reason }}</el-descriptions-item>
        <el-descriptions-item label="证据">
          <template v-if="hasEvidence(activeDispute)">
            <ul class="evidence-list">
              <li v-for="(item, index) in activeDispute.evidence" :key="index">{{ item }}</li>
            </ul>
          </template>
          <span v-else class="no-evidence">暂无证据</span>
        </el-descriptions-item>
      </el-descriptions>

      <el-alert
        v-if="!hasEvidence(activeDispute)"
        title="该争议目前没有证据，无法进行仲裁。请先补充证据或联系双方提供材料。"
        type="warning"
        show-icon
        class="mt-4"
      />

      <el-input
        type="textarea"
        v-model="adminReply"
        placeholder="请输入仲裁结果，将发送给双方"
        :rows="4"
        class="mt-4"
      />

      <template #footer>
        <el-button type="danger" @click="resolveDispute('支持发起方')" :disabled="!hasEvidence(activeDispute)">
          支持发起方
        </el-button>
        <el-button type="success" @click="resolveDispute('支持被诉方')" :disabled="!hasEvidence(activeDispute)">
          支持被诉方
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('ethics')

const settings = reactive({ allowReg: true, cooldown: 30, fee: 5 })

const users = ref([
  { username: 'zhangsan', name: '张三', role: 'subject', status: 'active' },
  { username: 'lisi', name: '李四', role: 'researcher', status: 'active' }
])

const pendingExperiments = ref([
  { id: 1, title: '视觉认知实验', researcher: '李四', ethicsNo: 'IRB-2024-001', riskLevel: '低' },
  { id: 2, title: '电击痛觉研究', researcher: '王五', ethicsNo: 'IRB-2024-088', riskLevel: '高' }
])

const disputes = ref([
  { id: 'DP-001', type: '支付争议', plaintiff: '被试(SUB-982)', defendant: '研究者(李四)', reason: '被试声称未收到报酬，研究者坚持已打款。', evidence: ['转账截图', '聊天记录截图'] },
  { id: 'DP-002', type: '评价申诉', plaintiff: '研究者(王五)', defendant: '被试(SUB-105)', reason: '研究者申诉被试恶意差评。', evidence: [] }
])

const hasEvidence = (dispute) => Array.isArray(dispute?.evidence) && dispute.evidence.length > 0

const toggleStatus = (row) => ElMessage.success(`用户 ${row.name} 状态已更新`)

const approveEthics = (row) => {
  ElMessage.success('伦理审查通过！已允许发布。')
  pendingExperiments.value = pendingExperiments.value.filter(e => e.id !== row.id)
}

const rejectEthics = (row) => {
  ElMessage.warning('已驳回，要求研究者重新修改知情同意书。')
  pendingExperiments.value = pendingExperiments.value.filter(e => e.id !== row.id)
}

const disputeDialog = ref(false)
const activeDispute = ref(null)
const adminReply = ref('')

const openDisputeHandle = (row) => {
  activeDispute.value = row
  adminReply.value = ''
  disputeDialog.value = true
}

const resolveDispute = (decision) => {
  if (!hasEvidence(activeDispute.value)) {
    ElMessage.warning('没有证据，无法进行仲裁。')
    return
  }
  ElMessage.success(`仲裁完成！结果：${decision}`)
  disputes.value = disputes.value.filter(d => d.id !== activeDispute.value.id)
  disputeDialog.value = false
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Banner */
.admin-banner {
  background: linear-gradient(105deg, #1a3558 0%, #234b8a 50%, #2a5fb8 100%);
  border-radius: 18px;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 36px rgba(26, 53, 88, 0.18);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.banner-left h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
}

/* Main Card */
.main-card {
  margin: 0;
}

.admin-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.tab-subtitle {
  font-size: 13px;
  color: #8899b8;
  margin-bottom: 16px;
  font-weight: 500;
}

/* Settings */
.settings-form {
  max-width: 480px;
}

/* Evidence */
.evidence-list {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  font-size: 13px;
}

.evidence-list li {
  padding: 3px 0;
}

.no-evidence {
  color: #c0c8d4;
  font-size: 13px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
