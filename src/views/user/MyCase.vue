<script setup>
import { ref, onMounted } from 'vue'
import { getCaseServe } from '@/api/user'

// 获取病例列表
onMounted(() => {
  getCaseList()
})
const getCaseList = async () => {
  const res = await getCaseServe()
  caseList.value[0] = res.data
}
const caseList = ref([
  {
    id: 23
  }
])

// 查看病例详情
const dialog = ref(false)
const caseDetail = ref()
const checkDetail = (row) => {
  dialog.value = true
  caseDetail.value = row
}
</script>

<template>
  <el-card>
    <el-table :data="caseList">
      <el-table-column label="病人ID" prop="userAddress"></el-table-column>
      <el-table-column label="医生名称" prop="doctorName"></el-table-column>
      <el-table-column label="科室" prop="departmentName"></el-table-column>
      <el-table-column label="医生地址" prop="doctorAddress"></el-table-column>
      <el-table-column label="个人信息管理" prop="patientInfo"></el-table-column>
      <el-table-column label="既往病史" prop="medicalHistory"></el-table-column>
      <el-table-column label="现病史" prop="immediateCase"></el-table-column>
      <el-table-column label="就诊状态">
        <template #default="{ row }">
          {{ row.state ? '就诊已结束' : '等待中' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="checkDetail(row)" type="primary">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialog">
      <div class="detail">
        <h1>北京同仁堂</h1>
        <h2>门诊病历</h2>
        <div class="header-info">
          <span>姓名：张三</span>
          <span>性别：男</span>
          <span>科别：{{ caseDetail.departmentName }}</span>
          <span>日期：2024-05-06 18:55:06</span>
        </div>
        <span class="detail-key">主治医师：</span>
        <span class="detail-value">{{ caseDetail.doctorName }}</span>
        <span class="detail-key">医师地址：</span>
        <span class="detail-value">{{ caseDetail.doctorAddress }}</span>
        <span class="detail-key">现病史：</span>
        <span class="detail-value">{{ caseDetail.immediateCase }}</span>
        <span class="detail-key">既往病史：</span>
        <span class="detail-value">{{ caseDetail.medicalHistory }}</span>
        <span class="detail-key">个人信息：</span>
        <span class="detail-value">{{ caseDetail.patientInfo }}</span>
        <div class="detail-footer">
          打印时间：2024-05-07 11:45:18
        </div>
      </div>
    </el-dialog>
  </el-card>
</template>

<style scoped>
.el-dialog {
  padding: 20px;
}

.detail {
  padding: 20px;
  text-align: center;
  font-size: 18px;
}

.detail h1 {
  padding-bottom: 20px;
  font-size: 28px;
  border-bottom: 1px solid #d6d6d6;
}

.detail h2 {
  margin-top: 20px;
  font-size: 28px;
}

.header-info {
  padding: 0 10px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #999;
}

.detail-key {
  display: inline-block;
  margin-top: 20px;
  width: 15%;
  line-height: 18px;
}

.detail-value {
  display: inline-block;
  margin-top: 20px;
  width: 85%;
  line-height: 18px;
}

.detail-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #999;
}
</style>