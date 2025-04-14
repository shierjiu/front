<template>
    <el-card>
        <el-row>
            <!-- 左侧：诊断结果选项 -->
            <el-col :span="12">
                <el-card title="诊断结果选项">
                    <ul class="my-list">
                        <!-- 用 item.currentIllnessId 作为 key, 以确保每条唯一 -->
                        <li v-for="(item) in diagnosisOptions" :key="item.currentIllnessId">
                            {{ item.currentIllness }}
                            <el-button @click="editDiagnosis(item)">修改</el-button>
                            <el-button @click="deleteDiagnosis(item)">删除</el-button>
                        </li>
                    </ul>
                    <el-button @click="openAddDiagnosisDialog">新增诊断</el-button>
                </el-card>
            </el-col>
            <!-- 右侧：治疗方案选项 -->
            <el-col :span="12">
                <el-card title="治疗方案选项">
                    <ul class="my-list">
                        <li v-for="(item) in treatmentOptions" :key="item.treatmentPlanId">
                            {{ item.treatmentPlan }}
                            <el-button @click="editTreatmentPlan(item)">修改</el-button>
                            <el-button @click="deleteTreatmentPlan(item)">删除</el-button>
                        </li>
                    </ul>
                    <el-button @click="openAddTreatmentPlanDialog">新增治疗方案</el-button>
                </el-card>
            </el-col>
        </el-row>

        <!-- 诊断编辑对话框 -->
        <el-dialog title="诊断操作" v-model="diagnosisDialogVisible" width="500px"> <!-- 修改标题 -->
            <el-form :model="isEditDiagnosis ? diagnosisFormData : addDiagnosisFormData" label-width="120px">
                <!-- 动态绑定表单数据 -->
                <el-form-item v-if="isEditDiagnosis" label="诊断ID"> <!-- 仅编辑时显示ID -->
                    <el-input v-model="diagnosisFormData.currentIllnessId" disabled />
                </el-form-item>
                <el-form-item label="诊断名称">
                    <el-input v-model="currentDiagnosisInput" placeholder="请输入诊断结果" />
                </el-form-item>
            </el-form>

            <div style="text-align: right">
                <el-button @click="diagnosisDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitDiagnosisEdit">
                    {{ isEditDiagnosis ? "确认修改" : "确认新增" }} <!-- 动态显示按钮文本 -->
                </el-button>
            </div>
        </el-dialog>


        <!-- 用于编辑“治疗方案”的弹窗 -->
        <el-dialog title="治疗方案操作" v-model="dialogVisible" width="500px"> <!-- 修改标题 -->
            <el-form :model="isEditTreatment ? formData : addTreatmentPlanFormData" ref="formRef" label-width="120px">
                <!-- 动态绑定表单数据 -->
                <el-form-item v-if="isEditTreatment" label="治疗方案ID"> <!-- 仅编辑时显示ID -->
                    <el-input v-model="formData.treatmentPlanId" :disabled="true" />
                </el-form-item>
                <el-form-item label="治疗方案">
                    <el-input v-model="currentTreatmentPlanInput" placeholder="请输入治疗方案内容" />
                </el-form-item>
            </el-form>

            <div style="text-align: right">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">
                    {{ isEditTreatment ? "确认修改" : "确认新增" }} <!-- 动态显示按钮文本 -->
                </el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import {
    getCurrentIllnessWithTreatmentPlanServe,
    updateTreatmentPlanServe,
    medicalConditionDescription,
    saveCurrentIllnessServe,
    saveTreatmentPlanServe,
    removeTreatmentPlanServe,
    removeCurrentIllnessServe
} from "@/api/user"

// ========== 诊断相关 ==========
const diagnosisOptions = ref([]) // [{ currentIllnessId, currentIllness }, ...]

// 是否显示“诊断编辑”的弹窗
const diagnosisDialogVisible = ref(false)

// 用于编辑诊断的表单数据
const diagnosisFormData = ref({
    currentIllnessId: 0,
    currentIllness: ""
})
// 新增诊断表单数据
const addDiagnosisFormData = ref({ currentIllness: "" })
// 是否为编辑诊断（区别新增/编辑）
const isEditDiagnosis = ref(false)

// 点击“修改”诊断时，弹出诊断编辑对话框
const editDiagnosis = (item) => {
    diagnosisFormData.value = { currentIllnessId: item.currentIllnessId, currentIllness: item.currentIllness }
    isEditDiagnosis.value = true // 标记为编辑状态
    diagnosisDialogVisible.value = true
}
// 打开新增诊断对话框
const openAddDiagnosisDialog = () => {
    addDiagnosisFormData.value.currentIllness = ""
    isEditDiagnosis.value = false // 标记为新增状态
    diagnosisDialogVisible.value = true
}
// 计算属性，用于动态绑定诊断结果输入框的值
const currentDiagnosisInput = computed({
    get() {
        return isEditDiagnosis.value ? diagnosisFormData.value.currentIllness : addDiagnosisFormData.value.currentIllness;
    },
    set(value) {
        if (isEditDiagnosis.value) {
            diagnosisFormData.value.currentIllness = value;
        } else {
            addDiagnosisFormData.value.currentIllness = value;
        }
    }
});
// 提交诊断编辑或新增
const submitDiagnosisEdit = async () => {
    if (!isEditDiagnosis.value && !addDiagnosisFormData.value.currentIllness) {
        ElMessage.warning("请输入诊断结果")
        return
    }
    try {
        let res;
        if (isEditDiagnosis.value) {
            res = await medicalConditionDescription(diagnosisFormData.value)
        } else {
            res = await saveCurrentIllnessServe({
                currentIllness: addDiagnosisFormData.value.currentIllness
            });
        }

        if (res.data && res.data.code === 1) {
            ElMessage.success(isEditDiagnosis.value ? "诊断结果更新成功" : "诊断结果新增成功")
            diagnosisDialogVisible.value = false

            // 核心：新增成功后重新获取全量数据（替代手动更新列表）
            if (!isEditDiagnosis.value) {
                fetchDiagnosisAndTreatment(); // 新增成功后调用数据获取函数
            } else {
                // 编辑时仍保留原更新逻辑（可选，也可统一重新获取）
                const idx = diagnosisOptions.value.findIndex(item => item.currentIllnessId === diagnosisFormData.value.currentIllnessId)
                if (idx !== -1) {
                    diagnosisOptions.value[idx].currentIllness = diagnosisFormData.value.currentIllness
                }
            }
        } else {
            ElMessage.error(res.data?.msg || "操作失败")
        }
    } catch (error) {
        console.error(error)
        ElMessage.error("操作出错，请检查网络或联系管理员")
    }
}
// 新增诊断删除函数
const deleteDiagnosis = async (item) => {
    try {
        // 二次确认
        await ElMessageBox.confirm("确认删除该诊断？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });
        // 调用删除接口
        await removeCurrentIllnessServe(item.currentIllnessId);
        ElMessage.success("诊断删除成功");
        // 更新本地列表
        diagnosisOptions.value = diagnosisOptions.value.filter(
            (i) => i.currentIllnessId !== item.currentIllnessId
        );
    } catch (error) {
        console.error(error);
        if (error !== "cancel") {
            ElMessage.error("删除诊断失败");
        }
    }
};
// ========== 治疗方案相关 ==========

// 治疗方案选项：[{ treatmentPlanId, treatmentPlan }, ...]
const treatmentOptions = ref([])

// 用于控制“治疗方案”弹窗显示/隐藏
const dialogVisible = ref(false)

// 用于编辑治疗方案的表单数据
const formData = ref({
    treatmentPlanId: 0,
    treatmentPlan: ""
})
// 新增治疗方案表单数据
const addTreatmentPlanFormData = ref({ treatmentPlan: "" })
// 是否为编辑治疗方案（区别新增/编辑）
const isEditTreatment = ref(false)
// 点击“修改”按钮时，弹出编辑弹窗
const editTreatmentPlan = (item) => {
    formData.value = { treatmentPlanId: item.treatmentPlanId, treatmentPlan: item.treatmentPlan }
    isEditTreatment.value = true // 标记为编辑状态
    dialogVisible.value = true
}
// 打开新增治疗方案对话框
const openAddTreatmentPlanDialog = () => {
    addTreatmentPlanFormData.value.treatmentPlan = ""
    isEditTreatment.value = false // 标记为新增状态
    dialogVisible.value = true
}
// 计算属性，用于动态绑定治疗方案输入框的值
const currentTreatmentPlanInput = computed({
    get() {
        return isEditTreatment.value ? formData.value.treatmentPlan : addTreatmentPlanFormData.value.treatmentPlan;
    },
    set(value) {
        if (isEditTreatment.value) {
            formData.value.treatmentPlan = value;
        } else {
            addTreatmentPlanFormData.value.treatmentPlan = value;
        }
    }
});

// 提交治疗方案更新
const submitForm = async () => {
    if (!isEditTreatment.value && !addTreatmentPlanFormData.value.treatmentPlan) {
        ElMessage.warning("请输入治疗方案")
        return
    }
    try {
        let res;
        if (isEditTreatment.value) {
            res = await updateTreatmentPlanServe(formData.value)
        } else {
            res = await saveTreatmentPlanServe({
                treatmentPlan: addTreatmentPlanFormData.value.treatmentPlan
            });
        }

        if (res.data && res.data.code === 1) {
            ElMessage.success(isEditTreatment.value ? "治疗方案更新成功" : "治疗方案新增成功")
            dialogVisible.value = false

            // 核心：新增成功后重新获取全量数据（替代手动更新列表）
            if (!isEditTreatment.value) {
                fetchDiagnosisAndTreatment(); // 新增成功后调用数据获取函数
            } else {
                // 编辑时仍保留原更新逻辑（可选，也可统一重新获取）
                const index = treatmentOptions.value.findIndex(item => item.treatmentPlanId === formData.value.treatmentPlanId)
                if (index !== -1) {
                    treatmentOptions.value[index].treatmentPlan = formData.value.treatmentPlan
                }
            }
        } else {
            ElMessage.error(res.data?.msg || "操作失败")
        }
    } catch (error) {
        console.error(error)
        ElMessage.error("操作出错，请检查网络或联系管理员")
    }
}
// 新增治疗方案删除函数
const deleteTreatmentPlan = async (item) => {
    try {
        // 二次确认
        await ElMessageBox.confirm("确认删除该治疗方案？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });
        // 调用删除接口
        await removeTreatmentPlanServe(item.treatmentPlanId);
        ElMessage.success("治疗方案删除成功");
        // 更新本地列表
        treatmentOptions.value = treatmentOptions.value.filter(
            (i) => i.treatmentPlanId !== item.treatmentPlanId
        );
    } catch (error) {
        console.error(error);
        if (error !== "cancel") {
            ElMessage.error("删除治疗方案失败");
        }
    }
};
// ======

// ========== 获取数据 ==========

const fetchDiagnosisAndTreatment = async () => {
    try {
        const res = await getCurrentIllnessWithTreatmentPlanServe()
        if (res.data.code === 1) {
            // currentIllnessList 现在假设包含 { currentIllnessId, currentIllness }
            // 如果后端还是只返回字符串，需要后端改动才能更好支持更新
            diagnosisOptions.value = res.data.data.currentIllnessList

            // 这里直接存对象，包含 { treatmentPlanId, treatmentPlan }
            treatmentOptions.value = res.data.data.treatmentPlanList
        }
    } catch (error) {
        ElMessage.error("获取诊断/治疗选项数据失败")
    }
}

// onMounted 时，拉取数据
onMounted(() => {
    fetchDiagnosisAndTreatment()
})
</script>

<style scoped>
.my-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.my-list li {
    padding: 8px 0;
    border-bottom: 1px solid #ebeef5;
}
</style>