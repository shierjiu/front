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
    <el-button :disabled="appointmented" @click="handleClick" type="primary">
      {{ appointmented ? '已预约' : '预约挂号' }}
    </el-button>
    <!-- 弹出框 -->
    <el-dialog v-model="dialogVisible" title="输入预约参数">
      <el-form :model="{}">
        <el-form-item label="年龄">
          <el-input v-model="age" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="gender" placeholder="请输入性别"></el-input>
        </el-form-item>
        <el-form-item label="过敏情况">
          <el-input v-model="allergies" placeholder="请输入过敏情况"></el-input>
        </el-form-item>
        <el-form-item label="症状">
          <el-input v-model="symptoms" placeholder="请输入症状"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
import { addAppointment } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

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

// 定义弹出框的显示状态
const dialogVisible = ref(false)
// 定义参数相关的 ref
const age = ref('')
const gender = ref('')
const allergies = ref('')
const symptoms = ref('')


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

// 处理弹出框的显示与隐藏
const handleOpenDialog = () => {
  dialogVisible.value = true
}
const handleConfirm = async () => {
  try {
    const response = await addAppointment(slotId.value, age.value, gender.value, allergies.value, symptoms.value);
    if (response.data.code === 1) {
      ElMessage.success('预约添加成功');
      appointmented.value = true; // 更新预约状态
      emit('getData'); // 通知父组件刷新数据
      dialogVisible.value = false; // 关闭弹出框
    } else {
      ElMessage.error(response.data.msg || '预约添加失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请检查网络或联系管理员');
  }
};

const handleClick = () => {
  ElMessageBox.confirm('是否需要输入额外的预约信息？', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  }).then(() => {
    handleOpenDialog()
  }).catch(() => {
    handleAddAppointment()
  })
}


</script>

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