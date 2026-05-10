<template>
  <div class="hello-world">
    <el-card class="box-card">
      <template #header>
        <span>{{ title }}</span>
      </template>
      <p>{{ message }}</p>
      <el-button type="primary" @click="handleClick">点击我</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const emit = defineEmits(['click'])

const handleClick = () => {
  ElMessage.success('你点击了按钮')
  emit('click')
}
</script>

<style scoped>
.hello-world {
  margin: 20px 0;
}

.box-card {
  background-color: #f5f7fa;
}

p {
  margin: 10px 0;
}
</style>
