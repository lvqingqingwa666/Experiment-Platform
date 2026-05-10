import request from '../utils/request'

// ==========================================
// ? 全局 Mock 开关
// true: 开启模拟数据 (前端单机演示模式)
// false: 开启真实请求 (连接后端真实服务器)
// ==========================================
const USE_MOCK = true

// 辅助函数：模拟网络延迟
const mockRequest = (data, delay = 500) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==========================================
// ? 真实的后端接口 (未来后端写好后走这里)
// ==========================================
const realUserApi = {
  login: (data) => request.post('/auth/login', data),
  logout: () => request.post('/logout')
}

const realExperimentApi = {
  getList: (params) => request.get('/experiments', { params }),
  getById: (id) => request.get(`/experiments/${id}`),
  create: (data) => request.post('/experiments', data),
  update: (id, data) => request.put(`/experiments/${id}`, data),
  publish: (id) => request.post(`/experiments/${id}/publish`),
  delete: (id) => request.delete(`/experiments/${id}`)
}

const realRegistrationApi = {
  getByExperiment: (experimentId) => request.get(`/registrations/experiment/${experimentId}`),
  approve: (id) => request.post(`/registrations/${id}/approve`),
  reject: (id, data) => request.post(`/registrations/${id}/reject`, data)
}

const realPaymentApi = {
  getRecords: (params) => request.get('/payment/records', { params }),
  confirmPayer: (data) => request.post('/payment/records/confirm-payer', data),
  handleDispute: (id, data) => request.post(`/payment/records/${id}/handle-dispute`, data)
}

const realReviewApi = {
  getReviews: (params) => request.get('/reviews', { params }),
  appealReview: (id, data) => request.post(`/reviews/${id}/appeal`, data)
}

const realCheckInApi = {
  getStats: (id) => request.get(`/experiments/${id}/checkin-stats`),
  manualCheckIn: (id, data) => request.post(`/experiments/${id}/manual-checkin`, data),
  refreshToken: (id) => request.post(`/experiments/${id}/refresh-checkin-token`),
  completeExperiment: (id) => request.post(`/experiments/${id}/complete`)
}


// ==========================================
// ? 模拟的前端接口 (现在的演示模式走这里)
// ==========================================
const mockUserApi = {
  login: (data) => mockRequest({
    token: 'mock-jwt-token-123456',
    user: {
      id: 999,
      name: data.username || '测试用户',
      role: data.role || 'researcher' // 动态返回你登录时选的角色
    }
  }),
  logout: () => mockRequest({ success: true })
}

const mockExperimentApi = {
  getList: (params) => mockRequest({ data: [], total: 5 }), 
  getById: (id) => mockRequest({
    id: id,
    title: '认知能力测试(模拟)',
    description: '这是一段从模拟接口拉取的实验描述...',
    location: '心理学系楼302室',
    startTime: '2024-06-15T14:00:00',
    maxParticipants: 30,
    compensation: 50,
    risk_level: 'low',
    screening_criteria: { age_range: [18, 35], gender: 'all', majors: [], handedness: 'all', exclusion: [], custom: [] },
    exclude_tags: [],
    cooling_days: 30,
    payment_method: 'OFFLINE'
  }),
  create: (data) => mockRequest({ id: 99, ...data }),
  update: (id, data) => mockRequest({ id, ...data }),
  publish: (id) => mockRequest({ success: true }),
  delete: (id) => mockRequest({ success: true })
}

const mockRegistrationApi = {
  getByExperiment: (id) => mockRequest([]), 
  approve: (id) => mockRequest({ success: true }),
  reject: (id, data) => mockRequest({ success: true })
}

const mockPaymentApi = {
  getRecords: (params) => mockRequest([]), 
  confirmPayer: (data) => mockRequest({ success: true }),
  handleDispute: (id, data) => mockRequest({ success: true })
}

const mockReviewApi = {
  getReviews: (params) => mockRequest([]), 
  appealReview: (id, data) => mockRequest({ success: true })
}

const mockCheckInApi = {
  getStats: (id) => mockRequest({ total: 30, checkedIn: 28 }),
  manualCheckIn: (id, data) => mockRequest({ success: true }),
  refreshToken: (id) => mockRequest({ token: 'NEW_TOKEN_123' }),
  completeExperiment: (id) => mockRequest({ success: true })
}

// ==========================================
// ? 最终导出：根据 USE_MOCK 开关自动决定使用哪一套
// ==========================================
export const userApi = USE_MOCK ? mockUserApi : realUserApi
export const experimentApi = USE_MOCK ? mockExperimentApi : realExperimentApi
export const registrationApi = USE_MOCK ? mockRegistrationApi : realRegistrationApi
export const paymentApi = USE_MOCK ? mockPaymentApi : realPaymentApi
export const reviewApi = USE_MOCK ? mockReviewApi : realReviewApi
export const checkInApi = USE_MOCK ? mockCheckInApi : realCheckInApi

export default {
  userApi,
  experimentApi,
  registrationApi,
  paymentApi,
  reviewApi,
  checkInApi
}