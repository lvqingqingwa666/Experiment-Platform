import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  // 状态
  const user = ref({
    name: '',
    id: null,
    role: '' // 被试/研究者/管理员
  })
  const token = ref('')
  const isLoggedIn = ref(false)

  // 计算属性
  const userInfo = computed(() => ({
    name: user.value.name,
    id: user.value.id,
    isLoggedIn: isLoggedIn.value
  }))

  // 方法
  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (newToken) => {
    token.value = newToken
  }

  const login = (userData, newToken) => {
    setUser(userData)
    setToken(newToken)
    isLoggedIn.value = true
    // 存储到 localStorage
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = { name: '', id: null, role: '' }
    token.value = ''
    isLoggedIn.value = false
    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // 初始化，从 localStorage 恢复状态
  const init = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    userInfo,
    setUser,
    setToken,
    login,
    logout,
    init
  }
})
