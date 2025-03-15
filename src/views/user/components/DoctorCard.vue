<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { registrationServe } from '@/api/user'
import { ElMessage } from 'element-plus';
const props = defineProps({
  doctorInfo: {
    type: Object
  }
})
const emit = defineEmits(['getData'])

// 预约成功按钮不可选
const appointmented = ref(false)
const registration = async () => {
  await registrationServe(props.doctorInfo)
  ElMessage.success('预约成功！')
  appointmented.value = true
  emit('getData')
}
</script>

<template>
  <div v-if="doctorInfo.appointmentNumber > 0" class="doctor-card">
    <img src="@/assets/doctor.jpg" alt="">
    <div class="doctor-info">
      <p>医生：{{ doctorInfo.name }}</p>
      <p>所属科室：{{ doctorInfo.departmentName }}</p>
      <p>日期：{{ doctorInfo.appointmentDate }}</p>
      <p>上午</p>
    </div>
    <span>剩余数量：{{ doctorInfo.appointmentNumber }}</span>
    <el-button :disabled="appointmented" @click="registration" type="primary">
      {{ appointmented ? '已预约' : '预约挂号' }}
    </el-button>
  </div>
</template>

<style scoped>
img {
  width: 130px;
  height: 156px;
}

.doctor-card {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  width: 400px;
  height: 250px;
  border: 1px solid rgb(232, 232, 232);
  font-size: 18px;
}

.doctor-card p {
  margin-top: 10px;
}

.doctor-card span {
  margin-top: 22px;
  margin-left: 20px;
}

.doctor-card .el-button {
  margin-left: 30px;
  width: 100px;
  height: 70px;
  font-size: 18px;
}

.doctor-info {
  margin-left: 20px;
  display: inline-block;
  width: 240px;
  height: 130px;
}

.doctor-card {
  margin-right: 20px;
}
</style>