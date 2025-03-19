<script setup>
import { ref, onMounted } from 'vue'
import { getMyAppointmentServe, updateAppointmentStatus } from '@/api/user'
import { ElMessage } from 'element-plus';
// 获取我的预约
onMounted(() => {
  getMyAppointment()
})
// 获取我的预约
const getMyAppointment = async () => {
  try {
    const res = await getMyAppointmentServe();
    console.log('接口返回数据：', res);

    if (res.data && res.data.code === 1) {
      tableData.value = res.data.data.records;
    } else {
      ElMessage.error('数据格式错误，未获取到有效预约信息');
      tableData.value = [];
    }

  } catch (error) {
    console.error('获取预约数据出错:', error);
    ElMessage.error('请求出错，请检查网络或稍后重试');
  }
};

const tableData = ref([
  {
    id: 2
  }
])

// 取消预约
const cancel = async (appointmentId) => {
  try {
    const res = await updateAppointmentStatus(appointmentId);
    if (res.data.code === 1) {
      ElMessage.success(res.data.data || '取消预约成功');
      await getMyAppointment(); // 重新获取数据，建议用 await 等待获取完成
    } else {
      ElMessage.error(res.data.msg || '取消预约失败');
    }
  } catch (error) {
    ElMessage.error('取消预约请求出错，请检查网络或联系管理员');
  }
};
</script>

<template>
  <el-card>
    <el-table :data="tableData">
      <el-table-column width="70px" label="ID" prop="appointmentId"></el-table-column>
      <el-table-column label="放号ID" prop="slotId"></el-table-column>
      <el-table-column label="预约日期" prop="appointmentDate"></el-table-column>
      <el-table-column label="用户id" prop="userId"></el-table-column>
      <el-table-column label="就诊状态">
        <template #default="{ row }">
          <el-button type="danger" disabled plain v-if="row.status === 1">就诊未结束</el-button>
          <el-button type="success" disabled plain v-if="row.status === 2">就诊已结束</el-button>
          <el-button type="secondary" disabled plain v-if="row.status === 3">已取消</el-button>
        </template>
      </el-table-column>
      <!-- 操作列，绑定取消逻辑 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button v-if="row.status === 1" @click="() => cancel(row.appointmentId)" type="primary">
            取消预约
          </el-button>
          <el-button v-if="row.status === 2" type="primary" disabled>
            已结束
          </el-button>
          <el-button v-if="row.status === 3" type="primary" disabled>
            已取消
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </el-card>
</template>