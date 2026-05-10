<template>
  <div class="not-found animate-in">
    <div class="nf-icon">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="4" y="4" width="72" height="72" rx="20" stroke="rgba(44,92,197,0.15)" stroke-width="3" fill="none"/>
        <text x="40" y="48" text-anchor="middle" font-size="36" font-weight="700" fill="#8899b8">404</text>
      </svg>
    </div>
    <h2>页面不存在</h2>
    <p>您访问的页面可能已被移除或地址有误。</p>
    <div class="nf-actions">
      <el-button type="primary" @click="goHome">返回首页</el-button>
      <el-button plain @click="goBack">返回上一页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => router.push('/')
const goBack = () => router.back()
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
}

.nf-icon {
  margin-bottom: 24px;
}

.not-found h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a3558;
  margin: 0 0 8px 0;
}

.not-found p {
  font-size: 14px;
  color: #8899b8;
  margin: 0 0 28px 0;
}

.nf-actions {
  display: flex;
  gap: 12px;
}
</style>
