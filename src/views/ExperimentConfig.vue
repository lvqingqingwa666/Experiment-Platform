<template>
  <div class="experiment-config">
    <el-page-header @back="goBack" class="config-header">
      <template #content>
        <span class="header-title">{{ isEdit ? '编辑实验' : '创建实验' }}</span>
      </template>
      <template #extra>
        <div class="header-actions">
          <el-button @click="handleSave('DRAFT')" :loading="submitting" plain>保存草稿</el-button>
          <el-button type="primary" @click="handleSave('PENDING_REVIEW')" :loading="submitting">提交审核</el-button>
        </div>
      </template>
    </el-page-header>

    <el-card class="form-card animate-in">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" label-position="top">
        <el-tabs v-model="activeTab" class="config-tabs">
          <el-tab-pane label="基础信息" name="basic">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="实验标题" prop="title">
                  <el-input v-model="form.title" placeholder="请输入直观的实验标题" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="实验描述" prop="description">
                  <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请详细描述实验目的、流程等" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实验地点" prop="location">
                  <el-input v-model="form.location" placeholder="例如：心理学系楼302室" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总人数上限" prop="maxParticipants">
                  <el-input-number v-model="form.maxParticipants" :min="1" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报名开始时间" prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    type="datetime"
                    placeholder="选择报名开始时间"
                    style="width: 100%"
                    @change="onStartTimeChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="报名截止时间" prop="endTime">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择报名截止时间"
                    style="width: 100%"
                    :disabled-date="disabledEndDate"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实验时长（分钟）" prop="duration">
                  <el-input-number v-model="form.duration" :min="1" placeholder="请输入实验时长" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="时间安排" name="slots">
            <el-alert
              title="设置多个可选时间段供被试在报名时选择"
              type="info"
              show-icon
              :closable="false"
              class="mb-4"
            />
            <div class="slots-list">
              <div v-for="(slot, index) in form.timeSlots" :key="index" class="slot-row">
                <span class="slot-index">时段 {{ index + 1 }}</span>
                <el-date-picker
                  v-model="slot.startTime"
                  type="datetime"
                  placeholder="开始时间"
                  style="width: 200px"
                />
                <span class="slot-sep">—</span>
                <el-date-picker
                  v-model="slot.endTime"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 200px"
                />
                <el-input-number
                  v-model="slot.capacity"
                  :min="1"
                  placeholder="人数"
                  style="width: 120px"
                />
                <el-button
                  type="danger"
                  plain
                  size="small"
                  @click="removeTimeSlot(index)"
                  :disabled="form.timeSlots.length <= 1"
                >删除</el-button>
              </div>
            </div>
            <el-button dashed @click="addTimeSlot" style="width: 100%; margin-top: 12px">
              + 添加时间段
            </el-button>
            <div v-if="timeSlotsSummary" class="slots-summary">
              共 {{ form.timeSlots.length }} 个时间段，总容纳 {{ timeSlotsSummary }} 人
            </div>
          </el-tab-pane>

          <el-tab-pane label="伦理信息" name="ethics">
            <el-form-item label="伦理审批编号">
              <el-input v-model="form.ethics_approval_no" placeholder="请输入IRB审批编号" />
            </el-form-item>
            <el-form-item label="风险等级">
              <el-radio-group v-model="form.risk_level">
                <el-radio label="low">低风险</el-radio>
                <el-radio label="medium">中风险</el-radio>
                <el-radio label="high">高风险</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="知情同意书上传">
              <el-upload class="upload-demo" action="/api/common/upload" :limit="1" :on-success="handleUploadSuccess">
                <el-button plain>点击上传 PDF 模板</el-button>
                <template #tip><div class="el-upload__tip">仅支持 PDF 格式文件</div></template>
              </el-upload>
            </el-form-item>
            <el-form-item label="风险说明">
              <el-input v-model="form.risk_description" type="textarea" :rows="3" placeholder="请对实验潜在风险进行说明" />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="筛选条件" name="screening">
            <el-form-item label="年龄范围">
              <el-input-number v-model="form.screening_criteria.age_range[0]" :min="0" />
              <span class="mx-2">至</span>
              <el-input-number v-model="form.screening_criteria.age_range[1]" :min="0" />
            </el-form-item>
            <el-form-item label="性别要求">
              <el-radio-group v-model="form.screening_criteria.gender">
                <el-radio label="all">不限</el-radio>
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="专业类别">
              <el-checkbox-group v-model="form.screening_criteria.majors">
                <el-checkbox label="psychology">心理学类</el-checkbox>
                <el-checkbox label="cs">计算机类</el-checkbox>
                <el-checkbox label="medical">医学类</el-checkbox>
                <el-checkbox label="other">其他</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-divider>自定义条件</el-divider>
            <div v-for="(item, index) in form.screening_criteria.custom" :key="index" class="custom-row">
              <el-input v-model="item.key" placeholder="条件名" class="mr-2" style="width: 200px" />
              <el-input v-model="item.value" placeholder="要求值" class="mr-2" />
              <el-button type="danger" plain @click="removeCustom(index)">删除</el-button>
            </div>
            <el-button dashed @click="addCustom" style="width: 100%">+ 添加自定义条件</el-button>
          </el-tab-pane>

          <el-tab-pane label="报酬信息" name="payment">
            <el-form-item label="报酬金额（元）" prop="payment_amount">
              <el-input-number v-model="form.payment_amount" :precision="2" :min="0" />
            </el-form-item>
            <el-form-item label="支付方式">
              <el-radio-group v-model="form.payment_method">
                <el-radio label="OFFLINE">线下支付</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="报酬说明">
              <el-input v-model="form.payment_description" type="textarea" placeholder="例如：实验结束后现场发放现金或转账" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { experimentApi } from '@/api'

const route = useRoute()
const router = useRouter()
const formRef = ref()
const activeTab = ref('basic')
const submitting = ref(false)
const isEdit = ref(!!route.params.id)

const form = reactive({
  title: '',
  description: '',
  location: '',
  startTime: null,
  endTime: null,
  duration: null,
  maxParticipants: 1,
  ethics_approval_no: '',
  risk_level: 'low',
  risk_description: '',
  screening_criteria: { age_range: [18, 60], gender: 'all', majors: [], handedness: 'all', exclusion: [], custom: [] },
  exclude_tags: [],
  cooling_days: 30,
  payment_amount: 0,
  payment_method: 'OFFLINE',
  payment_description: '实验结束后现场支付',
  timeSlots: [{ startTime: null, endTime: null, capacity: 1 }]
})

const timeSlotsSummary = computed(() => {
  const total = form.timeSlots.reduce((sum, s) => sum + (s.capacity || 0), 0)
  return total > 0 ? total : 0
})

const addTimeSlot = () => {
  form.timeSlots.push({ startTime: null, endTime: null, capacity: 1 })
}

const removeTimeSlot = (index) => {
  if (form.timeSlots.length > 1) {
    form.timeSlots.splice(index, 1)
  }
}

const validateEndTime = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请选择截止时间'))
  }
  if (form.startTime && new Date(value) <= new Date(form.startTime)) {
    return callback(new Error('截止时间不能早于或等于开始时间'))
  }
  callback()
}

const rules = {
  title: [{ required: true, message: '请输入实验标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入实验描述', trigger: 'blur' }],
  location: [{ required: true, message: '请输入实验地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [
    { required: true, message: '请选择截止时间', trigger: 'change' },
    { validator: validateEndTime, trigger: 'change' }
  ],
  duration: [{ required: true, message: '请输入实验时长', trigger: 'blur' }],
  payment_amount: [{ required: true, message: '请输入报酬金额', trigger: 'blur' }]
}

const disabledEndDate = (date) => {
  if (!form.startTime) return false
  return date.getTime() <= new Date(form.startTime).getTime()
}

const onStartTimeChange = () => {
  if (form.endTime && form.startTime) {
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      form.endTime = null
    }
  }
  formRef.value?.validateField('endTime')
}

const addCustom = () => form.screening_criteria.custom.push({ key: '', value: '' })
const removeCustom = (index) => form.screening_criteria.custom.splice(index, 1)

const handleSave = async (status) => {
  try {
    if (status === 'PENDING_REVIEW') await formRef.value.validate()
    submitting.value = true
    const payload = { ...form, status }
    if (isEdit.value) {
      await experimentApi.update(route.params.id, payload)
      ElMessage.success(status === 'DRAFT' ? '草稿已保存' : '实验已提交审核')
    } else {
      await experimentApi.create(payload)
      ElMessage.success(status === 'DRAFT' ? '草稿已保存' : '实验创建并提交审核成功')
    }
    router.push('/experiments')
  } catch (error) {
    ElMessage.error('请检查所有必填项是否已填写完整')
  } finally {
    submitting.value = false
  }
}

const goBack = () => router.back()
const handleUploadSuccess = () => {}

onMounted(async () => {
  if (isEdit.value) {
    const data = await experimentApi.getById(route.params.id)
    Object.assign(form, data)
  }
})
</script>

<style scoped>
.experiment-config {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-header {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.form-card {
  margin: 0;
}

.config-tabs :deep(.el-tabs__header) {
  margin-bottom: 28px;
}

.config-tabs {
  min-height: 400px;
}

.custom-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

/* Time Slots */
.slots-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f8faff;
  border-radius: 12px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  flex-wrap: wrap;
}

.slot-index {
  font-size: 13px;
  font-weight: 600;
  color: #2c5cc5;
  min-width: 50px;
}

.slot-sep {
  color: #8899b8;
  font-size: 13px;
}

.slots-summary {
  margin-top: 12px;
  font-size: 13px;
  color: #2c5cc5;
  font-weight: 500;
  text-align: right;
}

.mx-2 { margin: 0 0.5rem; }
.mr-2 { margin-right: 0.5rem; }
.mb-4 { margin-bottom: 16px; }
</style>
