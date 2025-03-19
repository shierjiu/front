<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { registrationServe } from '@/api/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  doctorInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['getData'])

// 是否已预约
const appointmented = ref(false)

// 点击“预约挂号”
const registration = async () => {
  try {
    // 将医生信息传给后端
    await registrationServe(props.doctorInfo)
    ElMessage.success('预约成功！')

    appointmented.value = true
    // 通知父组件刷新数据或做其他逻辑
    emit('getData')
  } catch (err) {
    ElMessage.error('预约失败，请稍后重试')
    console.error(err)
  }
}
</script>

<template>
  <!-- 当剩余数量 > 0 时才显示卡片 -->
  <div v-if="doctorInfo.remainingCount > 0" class="doctor-card">
    <img :src="doctorInfo.photoUrl" alt="医生照片" />
    <div class="doctor-info">
      <p>医生：{{ doctorInfo.name }}</p>
      <p>所属科室：{{ doctorInfo.departmentName }}</p>
      <!-- 父组件里叫 date -->
      <p>日期：{{ doctorInfo.date }}</p>
      <!-- 父组件里已是 session -->
      <p>{{ doctorInfo.session }}</p>
    </div>
    <span>剩余数量：{{ doctorInfo.remainingCount }}</span>
    <el-button :disabled="appointmented" @click="registration" type="primary">
      {{ appointmented ? '已预约' : '预约挂号' }}
    </el-button>
  </div>

</template>


<style scoped>
/* 父容器（存放所有卡片） */
.doctor {
  display: flex;
  /* 使用Flex布局，横向排列 */
  flex-wrap: wrap;
  /* 超出宽度就自动换行 */
  gap: 20px;
  /* 卡片之间的空隙（也可用margin，但gap更方便） */
  margin: 20px 0;
  /* 整体上下留空 */
  align-items: flex-start;
  /* 如果内容高度不一致，可顶对齐 */
}

/* 单个医生卡片 */
.doctor-card {
  width: 180px;
  /* 卡片宽度，可根据需要修改 */
  border: 1px solid #ccc;
  /* 边框 */
  border-radius: 4px;
  /* 圆角 */
  padding: 10px;
  /* 内边距 */
  box-sizing: border-box;
  /* 避免宽度被padding影响 */
  display: flex;
  flex-direction: column;
  /* 让内部元素垂直堆叠 */
  align-items: center;
  /* 水平居中 */
  background-color: #fff;
  /* 背景色 */
}

/* 医生照片 */
.doctor-card img {
  width: 80px;
  /* 按需设置宽高 */
  height: auto;
  object-fit: cover;
  /* 如果图片比例不同，也能保持视觉上的填充 */
  margin-bottom: 10px;
}

/* 医生信息 */
.doctor-info {
  text-align: center;
  /* 让文字在卡片内部居中 */
  margin-bottom: 10px;
}

/* “剩余数量” 与 按钮同一行时可再做微调 */
.doctor-card .el-button {
  margin-top: 10px;
  width: 100px;
  height: 38px;
  /* 使按钮稍小，适配卡片大小 */
  font-size: 14px;
}
</style>