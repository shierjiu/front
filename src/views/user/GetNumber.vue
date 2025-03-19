<script setup>
import { ref, onMounted } from 'vue'
import DoctorCard from './components/DoctorCard.vue'
import { getDoctorListServe, getDepartmentList, getAppointmentSlotInfo } from '@/api/user'
import { ElMessage } from 'element-plus';

// 获取医生列表
onMounted(async () => {
  try {
    const res = await getDoctorListServe() // 调用实际接口
    if (res.code === 200) {
      doctorList.value = res.data.records.map(doctor => ({
        ...doctor,
        // 处理预约时段：合并同一天的多个时段
        appointments: mergeSlotsByDate(doctor.appointmentslots)
      }))
      console.log('医生列表加载成功', doctorList.value)
    } else {
      console.error('获取医生列表失败', res.msg)
    }
  } catch (error) {
    console.error('网络请求失败', error)
  };
  fetchDepartmentList();
  fetchAppointmentSlot();
})

const department = ref('')// 科室
const departmentList = ref([]);// 科室列表
const appointmentSlot = ref(null);// 预约时段

const doctorList = ref([
  {
    name: "小明",
    departmentName: "儿童科",
    appointmentDate: "2024-12-12 00:00:00",
    appointmentTimeSlot: "上午",
    appointmentNumber: 40
  }
])

// 合并同一天的预约时段
const mergeSlotsByDate = (slots) => {
  return slots.reduce((acc, slot) => {
    const dateKey = slot.createDate
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: slot.createDate,
        morning: 0,
        afternoon: 0
      }
    }
    if (slot.session === '上午') acc[dateKey].morning = slot.remainingCount
    if (slot.session === '下午') acc[dateKey].afternoon = slot.remainingCount
    return acc
  }, {})
}

// 获取科室列表
const fetchDepartmentList = async () => {
  try {
    const response = await getDepartmentList();
    // console.log('科室列表', response.data);
    if (response.data.code === 1) {
      departmentList.value = response.data.data.records;
      //console.log('科室列表加载成功', departmentList.value);
    } else {
      ElMessage.error(response.data.msg || '获取部门列表失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请稍后重试');
  }
};

// 搜索科室
const search = async () => {
  try {
    if (!department.value) return ElMessage.warning('请选择科室');
    // 假设接口需要departmentId参数，这里需要根据实际API调整
    const res = await getDoctorListServe({ departmentId: department.value });
    console.log('搜索结果:', res);
    if (res.code === 200) {
      doctorList.value = res.data.records.map(doctor => ({
        ...doctor,
        appointments: mergeSlotsByDate(doctor.appointmentslots)
      }));
      // 收集 departmentName 到一个数组中
      const departmentNames = res.data.records.map(item => item.departmentName);
      console.log('收集到的科室名称数组:', departmentNames);
      ElMessage.success('搜索成功');
    }
  } catch (error) {
    console.error('搜索失败', error);
    ElMessage.error('搜索失败，请检查网络');
  }
};

// 获取预约时段信息(放号信息)
const fetchAppointmentSlot = async () => {
  try {
    const response = await getAppointmentSlotInfo();
    console.log('预约时段信息', response.data);
    if (response.data.code === 1) {
      appointmentSlot.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || '获取预约时段信息失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请稍后重试');
  }
};

</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-form :model="searchModel" inline>
        <el-form-item label="科室：">
          <el-select v-model="department" placeholder="请选择科室" :disabled="!departmentList.length">
            <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName"
              :value="item.departmentId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </template>

    <div class="doctor">
      <DoctorCard v-for="doctor in doctorList" :key="doctor.doctorId" :doctor-info="doctor" />
    </div>
  </el-card>
</template>

<style scoped>
.el-select {
  width: 150px;
}

.doctor {
  padding: 0 100px;
  margin-top: -20px;
  display: flex;
  flex-wrap: wrap;
  width: 1500px;
  height: 700px;
  overflow: scroll;
}
</style>