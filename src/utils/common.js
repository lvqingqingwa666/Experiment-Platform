/**
 * 通用工具函数集合
 */

/**
 * 防抖函数
 * @param {Function} func - 执行函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 执行函数
 * @param {number} limit - 间隔时间（毫秒）
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 获取 URL 查询参数
 * @param {string} key - 参数名
 * @returns {string|null}
 */
export const getQueryParam = (key) => {
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

/**
 * 本地存储
 */
export const storage = {
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: (key) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  remove: (key) => {
    localStorage.removeItem(key)
  },
  clear: () => {
    localStorage.clear()
  }
}

/**
 * 会话存储
 */
export const sessionStorage_ = {
  set: (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: (key) => {
    const value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  remove: (key) => {
    sessionStorage.removeItem(key)
  },
  clear: () => {
    sessionStorage.clear()
  }
}

/**
 * 判断是否为空
 * @param {any} value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true
  return false
}

/**
 * 深拷贝
 * @param {any} obj
 * @returns {any}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) {
    const cloneArr = []
    for (let i = 0; i < obj.length; i++) {
      cloneArr[i] = deepClone(obj[i])
    }
    return cloneArr
  }
  if (obj instanceof Object) {
    const cloneObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloneObj[key] = deepClone(obj[key])
      }
    }
    return cloneObj
  }
}

/**
 * 格式化日期
 * @param {Date} date - 日期对象
 * @param {string} format - 格式字符串，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string}
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  const map = {
    YYYY: date.getFullYear(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0')
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched])
}

export default {
  debounce,
  throttle,
  getQueryParam,
  storage,
  isEmpty,
  deepClone,
  formatDate
}
