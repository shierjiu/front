<template>
    <el-card>
        <!-- 输入框和查询按钮 -->
        <div>
            <el-input v-model="queryDepartmentId" placeholder="请输入科室 ID"></el-input>
            <el-button @click="queryDepartment">查询</el-button>
            <el-button @click="isDialogOpen = true">添加科室</el-button>
        </div>
        <!-- 显示查询结果 -->
        <div v-for="item in departmentList" :key="item.departmentId">
            <p>科室 ID：{{ item.departmentId }}</p>
            <p>科室名称：{{ item.departmentName }}</p>
            <p>描述：{{ item.description }}</p>
            <el-button type="success" @click="handleUpdate(item)">更新科室</el-button>
            <el-button type="danger" @click="deleteDepartment(item.departmentId)">删除科室</el-button>
            <hr>
        </div>

        <!-- 更新科室对话框 -->
        <el-dialog v-model="isUpdateDialogVisible" title="更新科室信息" width="400px">
            <el-form :model="updateForm" label-width="120px">
                <el-form-item label="科室ID">
                    <el-input v-model="updateForm.departmentId" disabled></el-input>
                </el-form-item>
                <el-form-item label="科室名称">
                    <el-input v-model="updateForm.departmentName"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="updateForm.description"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isUpdateDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitUpdate">提交更新</el-button>
            </template>
        </el-dialog>

        <el-dialog v-model="isDialogOpen" title="添加科室" width="400px">
            <el-form :model="formData" label-width="120px">
                <el-form-item label="科室名称">
                    <el-input v-model="formData.departmentName" placeholder="请输入科室名称"></el-input>
                </el-form-item>
                <el-form-item label="科室描述">
                    <el-input v-model="formData.description" placeholder="请输入科室描述"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isDialogOpen = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认提交</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDepartmentList, updateDepartmentServe, addDepartmentServe, deleteDepartmentServe } from '@/api/user';

const departmentList = ref([]);
const queryDepartmentId = ref('');
const isUpdateDialogVisible = ref(false);
const isDialogOpen = ref(false);
const updateForm = ref({
    departmentId: '',
    departmentName: '',
    description: ''
});
const formData = ref({
    departmentName: '',
    description: ''
});

// 查询科室
const queryDepartment = async () => {
    if (queryDepartmentId.value) {
        // 假设根据ID查询的接口逻辑
        // 此处简化处理，实际需根据接口调整
        departmentList.value = departmentList.value.filter(item =>
            item.departmentId === queryDepartmentId.value
        );
    } else {
        try {
            const res = await getDepartmentList();
            if (res.status === 200) {
                departmentList.value = res.data.data.records;
            }
        } catch (error) {
            console.error('查询错误', error);
        }
    }
};

// 打开更新对话框并填充数据
const handleUpdate = (item) => {
    updateForm.value = {
        departmentId: item.departmentId,
        departmentName: item.departmentName,
        description: item.description
    };
    isUpdateDialogVisible.value = true;
};

// 提交更新
const submitUpdate = async () => {
    try {
        const res = await updateDepartmentServe(updateForm.value);
        if (res.status === 200) {
            isUpdateDialogVisible.value = false;
            queryDepartment(); // 更新后刷新数据
        } else {
            console.error('更新失败', res.msg);
        }
    } catch (error) {
        console.error('更新请求错误', error);
    }
};

const submitForm = async () => {
    if (!formData.value.departmentName || !formData.value.description) {
        console.error('科室名称和描述为必填项');
        return;
    }

    try {
        const res = await addDepartmentServe(formData.value);
        if (res.status === 200) {
            console.log('科室添加成功', res.data);
            isDialogOpen.value = false;
            formData.value = { departmentName: '', description: '' };
        } else {
            console.error('科室添加失败', res.msg);
        }
    } catch (error) {
        console.error('请求接口出错', error);
    }
};

// 删除科室逻辑
const deleteDepartment = async (departmentId) => {
    try {
        const res = await deleteDepartmentServe(departmentId);
        if (res.status === 200) {
            console.log(res.data); // 输出：删除成功
            // 删除后刷新科室列表
            await queryDepartment();
        } else {
            console.error('删除失败', res.msg);
        }
    } catch (error) {
        console.error('删除请求异常', error);
    }
};
// 初始化查询
onMounted(() => {
    queryDepartment();
});
</script>

<style scoped>
::v-deep .el-table .cell {
    text-align: center;
}
</style>