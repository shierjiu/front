<template>
    <el-card>
        <el-button @click="handleButtonClick">开始问诊</el-button>
        <el-dialog v-model="isDialogOpen" title="填写问诊信息">
            <el-form :model="consultationForm" label-width="120px">
                <el-form-item label="用户ID">
                    <el-input v-model="consultationForm.userId" type="number"></el-input>
                </el-form-item>
                <el-form-item label="当前病情">
                    <el-input v-model="consultationForm.currentIlliness"></el-input>
                </el-form-item>
                <el-form-item label="既往病史">
                    <el-input v-model="consultationForm.pastHistory"></el-input>
                </el-form-item>
                <el-form-item label="诊断结果">
                    <el-input v-model="consultationForm.diagnosis"></el-input>
                </el-form-item>
                <el-form-item label="治疗方案">
                    <el-input v-model="consultationForm.treatmentPlan"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isDialogOpen = false">取消</el-button>
                <el-button type="primary" @click="submitConsultation">提交</el-button>
            </template>
        </el-dialog>
        <!-- 有数据时遍历渲染 -->
        <div v-if="consultationList.length > 0">
            <div v-for="item in consultationList" :key="item.appointmentId" class="consultation-item">
                预约 ID：{{ item.appointmentId }}
                用户 ID：{{ item.userId }}
                预约日期：{{ item.appointmentDate }}
            </div>
        </div>
        <!-- 无数据时显示提示 -->
        <div v-else class="no-data-tip">
            {{ response.data && response.data.msg || '暂无预约数据' }}
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getConsultation, saveConsultationServe } from '@/api/user';
import { ElMessage } from 'element-plus';

const consultationList = ref([]);
// 初始化 response 对象
const response = ref({ data: {} });

const isDialogOpen = ref(false);
const consultationForm = ref({
    userId: '',
    currentIlliness: '',
    pastHistory: '',
    diagnosis: '',
    treatmentPlan: ''
});

const fetchConsultation = async () => {
    try {
        const res = await getConsultation();
        response.value = res;
        if (res.data.code === 1) {
            consultationList.value = res.data.data.records || [];
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    }
};
const submitConsultation = async () => {
    try {
        const res = await saveConsultationServe(consultationForm.value);
        if (res.code === 1) {
            console.log(res.data); // 输出成功提示
            isDialogOpen.value = false; // 关闭对话框
            consultationForm.value = {
                userId: '',
                currentIlliness: '',
                pastHistory: '',
                diagnosis: '',
                treatmentPlan: ''
            }; // 清空表单
        } else {
            console.error('提交失败', res.msg);
        }
    } catch (error) {
        console.error('接口请求错误', error);
    }
};

const handleButtonClick = () => {
    console.log('开始问诊');
    isDialogOpen.value = true; // 打开对话框
};
onMounted(() => {
    fetchConsultation();
});
</script>

<style scoped>
.consultation-item {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.no-data-tip {
    color: #666;
    padding: 12px 0;
}
</style>