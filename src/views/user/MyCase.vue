<template>
  <el-card>
    <div>
      <el-button type="primary" @click="fetchConsultationRecords">获取就诊记录集合</el-button>
      <el-table :data="consultationRecords" stripe>
        <el-table-column prop="recordId" label="记录 ID" align="center"></el-table-column>
        <el-table-column prop="doctorName" label="医生姓名" align="center"></el-table-column>
        <el-table-column prop="consultationDate" label="就诊日期" align="center"></el-table-column>
        <el-table-column prop="currentIllness" label="当前病情" align="center"></el-table-column>
        <el-table-column prop="diagnosis" label="诊断结果" align="center"></el-table-column>
        <el-table-column prop="treatmentPlan" label="治疗方案" align="center"></el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { getConsultationRecordListServe } from '@/api/user';

// 假设从本地存储获取 token，实际项目中按需调整
const token = localStorage.getItem('userToken') || '';
const consultationRecords = ref([]);

const fetchConsultationRecords = async () => {
  try {
    const res = await getConsultationRecordListServe(token);
    if (res.status === 200) {
      consultationRecords.value = res.data.data.records;
    } else {
      console.error('获取就诊记录失败', res.msg);
    }
  } catch (error) {
    console.error('接口请求错误', error);
  }
};
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}
</style>