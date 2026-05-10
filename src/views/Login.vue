<template>
  <div class="login-container">
    <!-- Decorative background elements -->
    <div class="bg-shapes">
      <div class="shape shape-hex"></div>
      <div class="shape shape-circle-1"></div>
      <div class="shape shape-circle-2"></div>
      <div class="shape shape-dots"></div>
    </div>

    <div class="login-card animate-in">
      <!-- Logo & Header -->
      <div class="login-header">
        <div class="logo-hex">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#logo-grad)"/>
            <path d="M20 8l-8 4v6c0 7 4.5 12 8 13.5 3.5-1.5 8-6.5 8-13.5v-6l-8-4z" fill="white" opacity="0.95"/>
            <circle cx="20" cy="20" r="3.5" fill="rgba(44,92,197,0.35)"/>
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                <stop stop-color="#2c5cc5"/>
                <stop offset="1" stop-color="#3b8fa8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="title">实验管理系统</h1>
        <p class="subtitle">Evidence-based participant recruitment</p>
      </div>

      <!-- Login Form -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        class="login-form"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item prop="role" label="登录身份">
          <el-select
            v-model="loginForm.role"
            placeholder="请选择角色"
            size="large"
            style="width: 100%"
          >
            <el-option label="研究者" value="researcher" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登  录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <span>还没有账户？</span>
        <el-link type="primary" @click="goToRegister" :underline="false">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { userApi } from '@/api'
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  role: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    const response = await userApi.login({
      username: loginForm.username,
      password: loginForm.password,
      role: loginForm.role
    })
    const { token, user } = response
    store.login(user, token)
    ElMessage.success('登录成功！')
    redirectByRole(user.role)
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败，请检查用户名、密码和角色是否正确')
  } finally {
    loading.value = false
  }
}

const redirectByRole = (role) => {
  switch (role) {
    case 'researcher': router.push('/researcher'); break
    case 'admin': router.push('/admin'); break
    default: router.push('/')
  }
}

const goToRegister = () => router.push('/register')

onMounted(() => {
  if (store.isLoggedIn) redirectByRole(store.user.role)
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  box-sizing: border-box;
  background: linear-gradient(170deg, #eef3f9 0%, #f3f7fc 35%, #f8fafd 65%, #f0f5f9 100%);
  position: relative;
  overflow: hidden;
}

/* Noise texture overlay */
.login-container::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Decorative shapes */
.bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape {
  position: absolute;
}

.shape-hex {
  top: 8%;
  right: 6%;
  width: 200px;
  height: 200px;
  background: rgba(44, 92, 197, 0.035);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.shape-circle-1 {
  top: -5%;
  left: -3%;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(44, 92, 197, 0.05), transparent 70%);
  border-radius: 50%;
}

.shape-circle-2 {
  bottom: -5%;
  right: -3%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(59, 143, 168, 0.04), transparent 70%);
  border-radius: 50%;
}

.shape-dots {
  bottom: 12%;
  left: 8%;
  width: 140px;
  height: 140px;
  background-image: radial-gradient(circle, rgba(44, 92, 197, 0.06) 2px, transparent 2px);
  background-size: 22px 22px;
}

/* Login Card */
.login-card {
  position: relative;
  z-index: 1;
  width: 440px;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow:
    0 2px 16px rgba(30, 59, 107, 0.04),
    0 16px 48px rgba(30, 59, 107, 0.08);
  padding: 48px 40px;
  animation: cardEntry 0.5s cubic-bezier(0.22, 0.87, 0.36, 1.02);
}

@keyframes cardEntry {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-hex {
  display: inline-flex;
  margin-bottom: 20px;
}

.login-header .title {
  font-size: 26px;
  font-weight: 700;
  color: #1a3558;
  margin: 0 0 8px 0;
  letter-spacing: 0.02em;
}

.login-header .subtitle {
  font-size: 12px;
  color: #8899b8;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Form */
.login-form {
  width: 100%;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item__label) {
  font-size: 13px;
  font-weight: 600;
  color: #3b5078;
  padding-bottom: 6px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 10px !important;
  background: #f8faff;
  box-shadow: 0 1px 3px rgba(30, 59, 107, 0.04) !important;
  padding: 0 14px;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 8px rgba(44, 92, 197, 0.08) !important;
}

.login-form :deep(.el-input__prefix) {
  color: #8899b8;
}

.login-form :deep(.el-select .el-input__wrapper) {
  border-radius: 10px !important;
  background: #f8faff;
}

.login-form :deep(.el-button--primary) {
  background: linear-gradient(105deg, #234b8a 0%, #2c5cc5 50%, #3b8fa8 100%) !important;
  border: none !important;
  border-radius: 10px !important;
  font-weight: 600;
  font-size: 15px;
  height: 46px;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 16px rgba(44, 92, 197, 0.25);
  transition: all 0.3s cubic-bezier(0.45, 0, 0.25, 1);
}

.login-form :deep(.el-button--primary:hover) {
  box-shadow: 0 6px 24px rgba(44, 92, 197, 0.38);
  transform: translateY(-1px);
}

/* Footer */
.login-footer {
  text-align: center;
  margin-top: 28px;
  font-size: 14px;
  color: #7b8ba8;
}

.login-footer .el-link {
  font-weight: 600;
  margin-left: 4px;
  color: #2c5cc5;
}

@media (max-width: 480px) {
  .login-card {
    padding: 36px 24px;
    border-radius: 16px;
  }
}
</style>
