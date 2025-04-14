<template>
    <el-card>
        <el-button @click="handleButtonClick">开始问诊</el-button>
        <!-- 显示详细信息的对话框 -->
        <el-dialog v-model="isDetailDialogOpen" title="用户详细信息">
            <el-form :model="detailInfo" label-width="120px">
                <el-form-item label="用户ID">
                    <el-input v-model="detailInfo.userId" type="number" disabled></el-input>
                </el-form-item>
                <el-form-item label="当前病情">
                    <el-input v-model="detailInfo.currentIllness"></el-input>
                </el-form-item>
                <el-form-item label="既往病史">
                    <el-input v-model="detailInfo.pastHistory"></el-input>
                </el-form-item>
                <el-form-item label="记录日期">
                    <el-input v-model="detailInfo.recordDate"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-input v-model="detailInfo.gender"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="detailInfo.age" type="number"></el-input>
                </el-form-item>
                <el-form-item label="过敏史">
                    <el-input v-model="detailInfo.allergies"></el-input>
                </el-form-item>
                <el-form-item label="症状">
                    <el-input v-model="detailInfo.symptoms"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isDetailDialogOpen = false">关闭</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="isDialogOpen" title="填写问诊信息">
            <el-form :model="consultationForm" label-width="120px">
                <el-form-item label="用户ID">
                    <el-input v-model="consultationForm.userId" type="number"></el-input>
                </el-form-item>
                <el-form-item label="当前病情">
                    <el-input v-model="consultationForm.currentIllness"></el-input>
                </el-form-item>
                <el-form-item label="既往病史">
                    <el-input v-model="consultationForm.pastHistory"></el-input>
                </el-form-item>
                <el-form-item label="诊断结果">
                    <el-select v-model="consultationForm.diagnosis" filterable placeholder="请选择或输入诊断结果">
                        <el-option v-for="(item, index) in diagnosisOptions" :key="index" :label="item"
                            :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="治疗方案">
                    <el-select v-model="consultationForm.treatmentPlan" filterable placeholder="请选择或输入治疗方案">
                        <el-option v-for="(item, index) in treatmentOptions" :key="index" :label="item"
                            :value="item"></el-option>
                    </el-select>
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
                <el-button @click="showDetail(item.userId)">查看详情</el-button>
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
import { getConsultation, saveConsultationServe, getDetailedConsultation, getCurrentIllnessWithTreatmentPlanServe } from '@/api/user';
import { ElMessage } from 'element-plus';

const consultationList = ref([]);
const response = ref({ data: {} });

const isDialogOpen = ref(false);
const consultationForm = ref({
    userId: '',
    currentIllness: '',
    pastHistory: '',
    diagnosis: '',
    treatmentPlan: ''
});

const isDetailDialogOpen = ref(false);
const detailInfo = ref({});

// 诊断结果选项
const diagnosisOptions = ref([]);
// 治疗方案选项
const treatmentOptions = ref([]);

const fetchDiagnosisAndTreatment = async () => {
    try {
        const res = await getCurrentIllnessWithTreatmentPlanServe();
        if (res.data.code === 1) {
            // 从 currentIllnessList 提取诊断相关内容
            diagnosisOptions.value = res.data.data.currentIllnessList.map(item => item.currentIllness);
            // 从 treatmentPlanList 提取治疗方案内容
            treatmentOptions.value = res.data.data.treatmentPlanList.map(item => item.treatmentPlan);
        }
    } catch (error) {
        ElMessage.error('获取诊断/治疗选项数据失败');
    }
};


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
        if (res.data.code === 1) {
            console.log(res.data); // 输出成功提示
            isDialogOpen.value = false; // 关闭对话框
            consultationForm.value = {
                userId: '',
                currentIllness: '',
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

const showDetail = async (id) => {
    try {
        const res = await getDetailedConsultation(id);
        if (res.data.code === 1) {
            detailInfo.value = res.data.data;
            isDetailDialogOpen.value = true;
        } else {
            ElMessage.error('获取详情失败');
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    }
};

onMounted(() => {
    fetchConsultation();
    fetchDiagnosisAndTreatment(); // 初始化时获取选项数据
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