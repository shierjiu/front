<script setup>
import { ref, onMounted } from 'vue'
import { getMyAppointmentServe, cancelAppointmentServe } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus';
// 获取我的预约
onMounted(() => {
  getMyAppointment()
})
const getMyAppointment = async () => {
  const res = await getMyAppointmentServe()
  console.log(res.data)
  tableData.value[0] = res.data
}

const tableData = ref([
  {
    id: 2
  }
])

// 取消预约
const cancel = async () => {
  await ElMessageBox.confirm('你确认取消预约吗？', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await cancelAppointmentServe()
  ElMessage.success('取消预约成功！')
  getMyAppointment()
}
</script>

<template>
  <el-card>
    <el-table :data="tableData">
      <el-table-column width="70px" label="ID" prop="id"></el-table-column>
      <el-table-column label="医生名称" prop="name"></el-table-column>
      <el-table-column label="所属部门" prop="departmentName"></el-table-column>
      <el-table-column label="看病时间" prop="appointmentDate"></el-table-column>
      <el-table-column label="上午/下午" prop="appointmentTimeSlot"></el-table-column>
      <el-table-column label="就诊状态">
        <template #default="{ row }">
          <el-button type="danger" disabled plain v-if="row.state">就诊未结束</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="doctorID">
        <template #default="{ row }">
          <el-button v-if="row" @click="cancel" type="primary">取消预约</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

  </el-card>
</template>