<script setup>
import { ref, onMounted } from 'vue'
import DoctorCard from './components/DoctorCard.vue'
import { getDoctorListServe, getDepartmentList, getAppointmentSlotListByDeptName } from '@/api/user'
import { ElMessage } from 'element-plus';

// 获取医生列表
onMounted(async () => {
  await Promise.all([
    getDoctorListServe().catch(error => console.error('网络请求失败', error)),
    fetchDepartmentList()
  ]);

})

const department = ref('')// 科室
const departmentList = ref([]);// 科室列表
// 搜索模型
const searchModel = ref({
  departmentName: department.value
});

const doctorList = ref([])


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
    //console.log('搜索科室', department.value);
    if (!department.value) return ElMessage.warning('请选择科室');
    const res = await getAppointmentSlotListByDeptName(department.value);
    //console.log('搜索结果', res.data);
    if (res.data.code === 1) {
      const records = res.data.data.records || []
      doctorList.value = records.map(item => {
        const firstSlot = (item.appointmentslots && item.appointmentslots[0]) || {}
        return {
          doctorId: item.doctorId,
          name: item.name,
          departmentName: item.departmentName,
          date: firstSlot.createDate,
          session: firstSlot.session,
          remainingCount: firstSlot.remainingCount,
          // 这里仅示例，如需医生照片，请改成真实路径或后端返回的 URL
          photoUrl: '@/assets/doctor.jpg',
          slotId: firstSlot.slotId
        }
      })
      ElMessage.success('搜索成功')
    } else {
      ElMessage.error(res.data.msg || '搜索失败')
    }
  } catch (error) {
    console.error('搜索失败', error)
    ElMessage.error('搜索失败，请检查网络')
  }
}

</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-form :model="searchModel" inline>
        <el-form-item label="科室：">
          <el-select v-model="department" placeholder="请选择科室" :disabled="!departmentList.length">
            <el-option v-for="item in departmentList" :key="item.departmentId" :label="item.departmentName"
              :value="item.departmentName" />
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
  padding: 0 20px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  height: auto;
  overflow: visible;
}
</style>