<template>
  <div id="app">
    <template v-if="isAuthPage">
      <router-view />
    </template>

    <el-container v-else>
      <el-header class="app-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="rgba(255,255,255,0.2)"/>
                <path d="M14 6L6 10v4c0 5.5 3.4 10.6 8 12 4.6-1.4 8-6.5 8-12v-4l-8-4z" fill="white" opacity="0.9"/>
                <circle cx="14" cy="14" r="3" fill="rgba(255,255,255,0.6)"/>
              </svg>
            </div>
            <h1>被试招募管理系统 <span class="role-badge">{{ roleTitle }}</span></h1>
          </div>
          <div class="header-right">
            <div class="user-chip">
              <el-avatar :size="28" icon="UserFilled" class="user-avatar" />
              <span class="welcome-text">{{ store.user.name || '用户' }}</span>
            </div>
            <el-button class="logout-btn" size="small" plain @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>

      <el-container class="body-container">
        <el-aside width="220px" class="app-aside">
          <el-menu :default-active="route.path" router :unique-opened="true">

            <template v-if="store.user.role === 'researcher'">
              <el-menu-item index="/researcher">
                <el-icon><DataBoard /></el-icon>
                <span>数据工作台</span>
              </el-menu-item>
              <el-menu-item index="/experiments">
                <el-icon><Management /></el-icon>
                <span>实验管理</span>
              </el-menu-item>
              <el-menu-item index="/payments">
                <el-icon><Wallet /></el-icon>
                <span>支付确认管理</span>
              </el-menu-item>
              <el-menu-item index="/reviews">
                <el-icon><ChatLineSquare /></el-icon>
                <span>评价与申诉</span>
              </el-menu-item>
            </template>

            <template v-if="store.user.role === 'admin'">
              <el-menu-item index="/admin">
                <el-icon><Setting /></el-icon>
                <span>系统管理中心</span>
              </el-menu-item>
            </template>

          </el-menu>

          <div class="aside-footer">
            <div class="aside-decor">
              <div class="decor-dot"></div>
              <div class="decor-dot"></div>
              <div class="decor-dot"></div>
            </div>
            <span class="aside-version">v1.0.0</span>
          </div>
        </el-aside>

        <el-main class="app-main">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DataBoard, Management, Wallet, ChatLineSquare, Setting } from '@element-plus/icons-vue'
import { useMainStore } from '@/store'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))

const roleTitle = computed(() => {
  if (store.user.role === 'admin') return '管理员端'
  if (store.user.role === 'researcher') return '研究者端'
  return '管理后台'
})

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(175deg, #eaf1fd 0%, #f5f9ff 30%, #f8fbff 100%);
}

/* ===== Header ===== */
.app-header {
  background: linear-gradient(105deg, #1a3558 0%, #234b8a 40%, #2a5fb8 100%);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 28px;
  min-height: 64px;
  box-shadow: 0 4px 32px rgba(26, 53, 88, 0.2);
  position: relative;
  z-index: 100;
}

.app-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.12) 100%);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.header-left h1 {
  margin: 0;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.role-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 10px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-left: 10px;
  vertical-align: middle;
  letter-spacing: 0.04em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px 4px 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.user-avatar {
  background: rgba(255, 255, 255, 0.2) !important;
}

.welcome-text {
  font-size: 13px;
  font-weight: 500;
  opacity: 0.95;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  font-weight: 500;
  border-radius: 10px !important;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.35) !important;
}

/* ===== Sidebar ===== */
.body-container {
  height: calc(100vh - 64px);
}

.app-aside {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
  border-right: 1px solid rgba(210, 221, 239, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 0;
  height: calc(100vh - 64px);
}

.app-aside :deep(.el-menu) {
  border-right: none;
  background: transparent;
  padding: 8px 0;
}

.app-aside :deep(.el-menu-item) {
  margin: 4px 12px !important;
  border-radius: 12px !important;
  font-weight: 500;
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  transition: all 0.25s cubic-bezier(0.45, 0, 0.25, 1);
}

.app-aside :deep(.el-menu-item:hover) {
  background: rgba(44, 92, 197, 0.06) !important;
}

.app-aside :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(44, 92, 197, 0.1), rgba(59, 143, 168, 0.06)) !important;
  color: #2c5cc5 !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(44, 92, 197, 0.08);
}

.aside-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(210, 221, 239, 0.4);
}

.aside-decor {
  display: flex;
  gap: 6px;
}

.decor-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(44, 92, 197, 0.3);
}

.decor-dot:nth-child(2) {
  background: rgba(44, 92, 197, 0.5);
}

.decor-dot:nth-child(3) {
  background: rgba(59, 143, 168, 0.4);
}

.aside-version {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

/* ===== Main Content ===== */
.app-main {
  padding: 24px 28px;
  background: transparent;
  min-height: calc(100vh - 64px);
  overflow-y: auto;
}

/* Page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
