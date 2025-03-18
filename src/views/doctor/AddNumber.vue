<script setup>
import { ref, onMounted } from 'vue'
import { appointmentSlot, updateAppointmentSlot, doctorGetAppointmentListServe } from '@/api/user'
import { ElMessage } from 'element-plus';
// 医生获取预约列表
onMounted(() => {
  getAppointmentList()

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



// 展示列表数据
const tableData = ref([])


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
// 更新对话框显示状态
const dialogUpdate = ref(false);
// 更新表单引用
const updateForm = ref();
// 更新表单数据模型
const updateModel = ref({
  slotId: 0,
  session: '',
  remainingCount: 0
});
// 更新表单验证规则
const updateRules = {
  session: [
    { required: true, message: '请选择时间段', trigger: 'change' }
  ],
  remainingCount: [
    { required: true, message: '请输入放号量', trigger: 'blur' },
    { type: 'number', message: '请输入有效数字', trigger: 'blur' },
    { validator: (rule, value) => value >= 0, message: '放号数不能为负数', trigger: 'blur' }
  ]
};
const updateRegistration = async (row) => {
  // 直接赋值并显示更新对话框
  updateModel.value = {
    slotId: row.slotId,
    session: row.session,
    remainingCount: row.remainingCount
  };
  dialogUpdate.value = true;
};
const subUpdate = async () => {
  try {
    // 验证更新表单
    await updateForm.value.validate();
    // 调用更新接口
    await updateAppointmentSlot(updateModel.value);
    ElMessage.success('更新成功！');
    // 关闭更新对话框
    dialogUpdate.value = false;
    // 重新获取预约列表
    await getAppointmentList();
  } catch (error) {
    ElMessage.error(error.message);
  }
};
const dialogUpdateClose = () => {
  // 重置更新表单数据
  updateModel.value = { slotId: 0, session: '', remainingCount: 0 };
};

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
          <!-- 修改按钮点击事件 -->
          <el-button @click="updateRegistration(row)" type="primary">更新</el-button>
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

    <el-dialog @close="dialogUpdateClose" width="25%" v-model="dialogUpdate" title="更新挂号信息">
      <el-form label-width="90px" ref="updateForm" :model="updateModel" :rules="updateRules">
        <el-form-item label="时间段：" prop="session">
          <el-select v-model="updateModel.session" placeholder="请选择时间段">
            <el-option label="上午" value="上午"></el-option>
            <el-option label="下午" value="下午"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="放号量：" prop="remainingCount">
          <el-input placeholder="请输入放号量" v-model.number="updateModel.remainingCount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="subUpdate" type="primary">保存</el-button>
          <el-button @click="dialogUpdate = false" type="primary">取消</el-button>
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
