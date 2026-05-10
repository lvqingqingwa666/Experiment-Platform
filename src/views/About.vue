<template>
  <div class="about">
    <!-- Hero Section -->
    <div class="about-hero animate-in">
      <div class="hero-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="url(#hero-grad)"/>
          <path d="M24 12L14 17v6c0 8.5 5 15 10 17 5-2 10-8.5 10-17v-6l-10-5z" fill="white" opacity="0.95"/>
          <circle cx="24" cy="24" r="4.5" fill="rgba(44,92,197,0.3)"/>
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="48" y2="48">
              <stop stop-color="#2c5cc5"/>
              <stop offset="1" stop-color="#3b8fa8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="hero-text">
        <h2>关于本项目</h2>
        <p>基于 Vite + Vue 3 + Element Plus 构建的现代化被试招募管理系统</p>
      </div>
    </div>

    <el-alert
      title="欢迎使用"
      type="info"
      description="这是一个使用 Vite + Vue3 + Element Plus 构建的完整管理后台模板，集成了实验管理、被试招募、支付确认等功能模块。"
      :closable="false"
      class="info-alert"
    />

    <!-- Tech Stack Section -->
    <div class="section-header">
      <h3>项目技术栈</h3>
      <p class="section-desc">采用现代化前端技术栈构建，确保高性能与可维护性</p>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8">
        <div class="tech-card animate-in animate-in-1">
          <div class="tech-card-icon frontend">
            <el-icon :size="22"><Monitor /></el-icon>
          </div>
          <h4>Frontend</h4>
          <ul>
            <li><span class="dot"></span>Vue 3</li>
            <li><span class="dot"></span>Vite</li>
            <li><span class="dot"></span>Element Plus</li>
            <li><span class="dot"></span>Vue Router</li>
            <li><span class="dot"></span>Pinia</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <div class="tech-card animate-in animate-in-2">
          <div class="tech-card-icon tools">
            <el-icon :size="22"><Setting /></el-icon>
          </div>
          <h4>Tools</h4>
          <ul>
            <li><span class="dot"></span>Axios</li>
            <li><span class="dot"></span>ESLint</li>
            <li><span class="dot"></span>Prettier</li>
            <li><span class="dot"></span>EditorConfig</li>
          </ul>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <div class="tech-card animate-in animate-in-3">
          <div class="tech-card-icon features">
            <el-icon :size="22"><Star /></el-icon>
          </div>
          <h4>Features</h4>
          <ul>
            <li><span class="dot"></span>响应式设计</li>
            <li><span class="dot"></span>代码规范</li>
            <li><span class="dot"></span>路由懒加载</li>
            <li><span class="dot"></span>请求拦截</li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <!-- Quick Start Section -->
    <div class="section-header">
      <h3>快速开始</h3>
      <p class="section-desc">四步完成项目的初始化与启动</p>
    </div>

    <el-card class="steps-card">
      <el-steps :active="activeStep" align-center process-status="process" finish-status="success">
        <el-step title="安装依赖" description="npm install" />
        <el-step title="开发模式" description="npm run dev" />
        <el-step title="构建项目" description="npm run build" />
        <el-step title="预览产物" description="npm run preview" />
      </el-steps>
      <div class="steps-action">
        <el-button type="primary" @click="activeStep = Math.min(activeStep + 1, 3)" :disabled="activeStep >= 3">
          下一步
        </el-button>
        <el-button @click="activeStep = Math.max(activeStep - 1, 0)" :disabled="activeStep <= 0">
          上一步
        </el-button>
        <el-button v-if="activeStep === 3" type="success" @click="activeStep = 0">重新开始</el-button>
      </div>
    </el-card>

    <!-- Code Standards Section -->
    <div class="section-header">
      <h3>代码规范</h3>
      <p class="section-desc">保障代码质量与团队协作效率</p>
    </div>

    <el-descriptions :column="2" border class="desc-table">
      <el-descriptions-item label="ESLint">
        <el-tag type="primary" effect="light" size="small">代码质量</el-tag>
        自动检查代码质量
      </el-descriptions-item>
      <el-descriptions-item label="Prettier">
        <el-tag type="success" effect="light" size="small">代码格式</el-tag>
        自动格式化代码
      </el-descriptions-item>
      <el-descriptions-item label="命名规范">
        <el-tag type="warning" effect="light" size="small">规范</el-tag>
        使用 camelCase 和 PascalCase
      </el-descriptions-item>
      <el-descriptions-item label="提交规范">
        <el-tag type="info" effect="light" size="small">Git</el-tag>
        遵循 Commit Message 规范
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Monitor, Setting, Star } from '@element-plus/icons-vue'

const activeStep = ref(0)
</script>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero */
.about-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: linear-gradient(105deg, #1a3558 0%, #234b8a 50%, #2a5fb8 100%);
  border-radius: 18px;
  box-shadow: 0 8px 36px rgba(26, 53, 88, 0.18);
  position: relative;
  overflow: hidden;
}

.about-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -5%;
  width: 240px;
  height: 240px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
}

.hero-text h2 {
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}

.hero-text p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* Alert */
.info-alert {
  margin: 0;
}

/* Section Header */
.section-header {
  margin: 8px 0 4px 0;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e3b6b;
  margin: 0 0 4px 0;
  letter-spacing: -0.01em;
}

.section-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* Tech Cards */
.tech-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 28px 24px;
  border: 1px solid rgba(210, 221, 239, 0.5);
  box-shadow: 0 4px 16px rgba(30, 59, 107, 0.06);
  transition: all 0.3s cubic-bezier(0.45, 0, 0.25, 1);
  margin-bottom: 20px;
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(30, 59, 107, 0.1);
}

.tech-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.tech-card-icon.frontend {
  background: rgba(44, 92, 197, 0.1);
  color: #2c5cc5;
}

.tech-card-icon.tools {
  background: rgba(59, 143, 168, 0.1);
  color: #3b8fa8;
}

.tech-card-icon.features {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.tech-card h4 {
  margin: 0 0 14px 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e3b6b;
}

.tech-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tech-card li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  color: #475569;
  font-size: 14px;
  line-height: 1;
}

.tech-card .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(44, 92, 197, 0.35);
  flex-shrink: 0;
}

/* Steps */
.steps-card {
  margin: 0;
}

.steps-action {
  text-align: center;
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* Descriptions */
.desc-table {
  margin: 0;
}

.desc-table :deep(.el-tag) {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .about-hero {
    flex-direction: column;
    text-align: center;
  }
}
</style>
