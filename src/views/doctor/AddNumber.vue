<script setup>
import { ref, onMounted } from 'vue'
import { appointmentSlot, doctorStartDiagnoseServe, doctorEndDiagnoseServe, getDepartmentListServe, doctorGetAppointmentListServe } from '@/api/user'
import { ElMessage } from 'element-plus';
// 医生获取预约列表
onMounted(() => {
  getAppointmentList()
  getDepartmentList()
})
const getAppointmentList = async () => {
  const res = await doctorGetAppointmentListServe(pagination.value);
  console.log("API 响应数据:", res); // 先打印整个 res，看看结构
  if (res.data.code === 1) {
    tableData.value = [res.data.data];
    total.value = tableData.value.length;
    console.log('获取到的预约列表:', tableData.value);
    console.log('总数:', total.value);
  } else {
    ElMessage.error(res.msg || '获取数据失败');
  }
}


const getDepartmentList = async () => {
  const res = await getDepartmentListServe()
  departmentList.value = res.data.data
}

// 展示列表数据
const tableData = ref([])

const departmentList = ref([
  {
    id: 5,
    departmentName: "内科"
  }
])

// 新增挂号
const dialogAdd = ref(false)
const addForm = ref()
const addModel = ref({ session: '', remainingCount: '' })
const addRules = {
  session: [
    { required: true, message: '请选择时间段', trigger: 'change' }
  ],
  remainingCount: [
    { required: true, message: '请输入放号量', trigger: 'blur' },
    { validator: (rule, value) => value >= 0, message: '放号数不能为负数', trigger: 'blur' }
  ]
}
const addRegistration = () => {
  dialogAdd.value = true
}

// 在提交时自动生成session
const subAdd = async () => {
  try {
    await addForm.value.validate()
    await appointmentSlot(addModel.value)
    ElMessage.success('新增成功！')
    dialogAdd.value = false
    addModel.value = { session: '', remainingCount: '' }
  } catch (error) {
    ElMessage.error(error.message)
  }
}

const dialogAddClose = () => {
  addModel.value = { session: '', remainingCount: '' }
}
// 开始就诊
const dialogStart = ref(false)
const startForm = ref()
const startModel = ref({
  id: '',
  contractAddress: ''
})
const startRules = {
  contractAddress: [
    { required: true, message: '请输入患者地址', trigger: 'blur' }
  ]
}
const startDiagnose = (id) => {
  startModel.value.id = id
  dialogStart.value = true
}
const subStart = async () => {
  await startForm.value.validate()
  await doctorStartDiagnoseServe()
  ElMessage.success('开始就诊')
  dialogStart.value = false
}

const dialogStartClose = () => {
  startModel.value.contractAddress = ''
}

// 结束就诊
const dialogEnd = ref(false)
const endForm = ref()
const endModel = ref({
  userAddress: '',
  patientInfo: '',
  immediateCase: '',
  medicalHistory: ''
})
const endRules = {
  userAddress: [
    { required: true, message: '请输入患者地址', trigger: 'blur' }
  ],
  patientInfo: [
    { required: true, message: '请输入患者信息', trigger: 'blur' }
  ],
  immediateCase: [
    { required: true, message: '请输入既往病史', trigger: 'blur' }
  ],
  medicalHistory: [
    { required: true, message: '请输入既病史', trigger: 'blur' }
  ]
}

const subEnd = async () => {
  await endForm.value.validate()
  await doctorEndDiagnoseServe(endModel.value)
  ElMessage.success('问诊结束！')
  dialogEnd.value = false
}

const dialogEndClose = () => {
  endModel.value.userAddress = ''
  endModel.value.patientInfo = ''
  endModel.value.immediateCase = ''
  endModel.value.medicalHistory = ''
}


// 分页模块
const total = ref(0)
const pagination = ref({
  current: 1,
  size: 5
})
// 分页处理
const onSizeChange = async (newSize) => {
  pagination.value.size = newSize;
  await getAppointmentList();
}
const onCurrentChange = async (newCurrent) => {
  pagination.value.current = newCurrent;
  await getAppointmentList();
}
</script>

<template>
  <el-card>
    <template #header>
      <el-button @click="addRegistration" type="primary">新增挂号</el-button>
    </template>

    <el-table :data="tableData" stripe>
      <el-table-column label="ID" prop="slotId"></el-table-column>
      <el-table-column label="医生姓名" prop="doctorName"></el-table-column>
      <el-table-column label="日期" prop="createDate"></el-table-column>
      <el-table-column label="时间段" prop="session"></el-table-column>
      <el-table-column label="剩余号源" prop="remainingCount"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template #default="{ row }">
          <el-button @click="startDiagnose(row.slotId)" type="primary">更新</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size" :total="total"
      :page-sizes="[5, 10, 15]" layout="total, sizes, prev, pager, next, jumper" @size-change="onSizeChange"
      @current-change="onCurrentChange" />
    <el-dialog @close="dialogAddClose" width="25%" v-model="dialogAdd">
      <div class="dia-contain">
        <el-form label-width="90px" ref="addForm" :model="addModel" :rules="addRules">
          <el-form-item label="时间段：" prop="session">
            <el-select v-model="addModel.session" placeholder="请选择时间段">
              <el-option label="上午" value="上午"></el-option>
              <el-option label="下午" value="下午"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="放号量：" prop="remainingCount">
            <el-input placeholder="请输入放号量" v-model.number="addModel.remainingCount"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="subAdd" type="primary">新增</el-button>
            <el-button @click="dialogAdd = false" type="primary">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog @close="dialogStartClose" width="25%" v-model="dialogStart">
      <div class="dia-contain">
        <el-form label-width="100px" ref="startForm" :model="startModel" :rules="startRules">
          <el-form-item label="id:" prop="id">
            <el-input disabled v-model="startModel.id"></el-input>
          </el-form-item>
          <el-form-item label="患者地址" prop="contractAddress">
            <el-input v-model="startModel.contractAddress" placeholder="请输入患者地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="subStart" type="primary">开始就诊</el-button>
            <el-button @click="dialogStart = false" type="primary">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog @close="dialogEndClose" width="47%" v-model="dialogEnd">
      <h1>结束就诊</h1>
      <el-form ref="endForm" :model="endModel" :rules="endRules" inline>
        <el-form-item label="医生:">
          <el-input disabled class="mar-ri" style="width: 150px" v-model="tableData.name"
            placeholder="请输入医生"></el-input>
        </el-form-item>
        <el-form-item label="医生地址:">
          <el-input disabled style="width: 550px" v-model="tableData.contractAddress" placeholder="请输入医生地址"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="患者地址:" prop="userAddress">
          <el-input style="width: 550px" v-model="endModel.userAddress" placeholder="请输入患者地址"></el-input>
        </el-form-item>
        <p>患者信息管理：</p>
        <el-form-item label="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" prop="patientInfo">
          <el-input type="textarea" :input-style="{ width: '84vh', height: '90px' }"
            v-model="endModel.patientInfo"></el-input>
        </el-form-item>
        <p>既往病史：</p>
        <el-form-item label="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" prop="medicalHistory">
          <el-input type="textarea" :input-style="{ width: '84vh', height: '90px' }"
            v-model="endModel.medicalHistory"></el-input>
        </el-form-item>
        <p>现病史：</p>
        <el-form-item label="&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" prop="immediateCace">
          <el-input type="textarea" :input-style="{ width: '84vh', height: '90px' }"
            v-model="endModel.immediateCace"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="subEnd" style="margin-left: 690px" type="primary">结束就诊</el-button>
          <el-button class="right" @click="dialogEnd = false" type="primary">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<style scoped>
.el-dialog {
  padding: 0 40px;
}

.el-select {
  width: 280px;
}

.el-input {
  width: 280px;
}

.dia-contain {
  margin-left: 10px;
}

.el-dialog h1 {
  margin-bottom: 50px;
  text-align: center;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.mar-ri {
  margin-right: 32px;
}
</style>
