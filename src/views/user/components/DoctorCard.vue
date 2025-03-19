<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { addAppointment } from '@/api/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  doctorInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['getData'])
const slotId = ref(props.doctorInfo.slotId || '')
// 是否已预约
console.log('props.doctorInfo', props.doctorInfo);
const appointmented = ref(false)

const handleAddAppointment = async () => {
  //console.log('点击触发，slotId:', slotId.value, 'appointed:', appointmented.value);
  if (!slotId.value) {
    ElMessage.warning('请确认预约时段信息');
    return;
  }
  try {
    const response = await addAppointment(slotId.value);
    if (response.data.code === 1) {
      ElMessage.success('预约添加成功');
      appointmented.value = true; // 更新预约状态
      emit('getData'); // 通知父组件刷新数据
    } else {
      ElMessage.error(response.data.msg || '预约添加失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请检查网络或联系管理员');
  }
};
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
    <el-button :disabled="appointmented" @click="handleAddAppointment" type="primary">
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