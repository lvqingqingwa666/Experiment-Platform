import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login' // 访问根目录时，自动跳转到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/experiments/config/:id?', 
    name: 'ExperimentConfig',
    component: () => import('../views/ExperimentConfig.vue'),
    meta: { 
      title: '实验配置', 
      requiresAuth: true, 
      role: 'researcher' 
    }
  },
  {
    path: '/experiments/review/:id',
    name: 'RegistrationReview',
    component: () => import('../views/RegistrationReview.vue'),
    meta: { title: '报名审核', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/payments',
    name: 'PaymentManagement',
    component: () => import('../views/PaymentManagement.vue'),
    meta: { title: '支付确认管理', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/reviews',
    name: 'ReviewManagement',
    component: () => import('../views/ReviewManagement.vue'),
    meta: { title: '评价查看与申诉', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/experiments/checkin/:id',
    name: 'CheckInManagement',
    component: () => import('../views/CheckInManagement.vue'),
    meta: { title: '现场签到管理', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/researcher',
    name: 'Researcher',
    component: () => import('../views/Researcher.vue'),
    meta: { title: '研究者面板', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { title: '管理员面板', requiresAuth: true, role: 'admin' }
  },
  {
    path: '/experiments',
    name: 'ExperimentManagement',
    component: () => import('../views/ExperimentManagement.vue'),
    meta: { title: '实验管理', requiresAuth: true, role: 'researcher' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '实验管理系统'
  next()
})

export default router