<template>
    <el-card>
        <!-- 搜索框 -->
        <div class="search-container">
            <el-input v-model="searchParams.name" placeholder="请输入医生姓名" @keyup.enter="fetchDoctorList"></el-input>
            <el-input v-model="searchParams.departmentId" placeholder="请输入科室名称"
                @keyup.enter="fetchDoctorList"></el-input>
            <el-button type="primary" @click="fetchDoctorList">搜索</el-button>
            <!-- 添加医生按钮 -->
            <el-button type="success" @click="openAddDoctorDialog">添加医生</el-button>
        </div>

        <!-- 医生列表 -->
        <el-table :data="doctorList.records" stripe>
            <el-table-column prop="doctorId" label="医生 ID" align="center" header-align="center"></el-table-column>
            <el-table-column prop="name" label="医生姓名" align="center" header-align="center"></el-table-column>
            <el-table-column prop="departmentId" label="所属科室Id" align="center" header-align="center"></el-table-column>
            <!-- 操作列 -->
            <el-table-column label="操作" align="center" header-align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleUpdate(scope.row)">更新</el-button>
                    <el-button type="danger" size="small" @click="deleteDoctor(scope.row.doctorId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 更新医生信息对话框 -->
        <el-dialog v-model="isUpdateDialogVisible" title="更新医生信息" width="500px">
            <el-form :model="updateForm" label-width="120px">
                <el-form-item label="医生 ID">
                    <el-input v-model="updateForm.doctorId" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="updateForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="updateForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="updateForm.name"></el-input>
                </el-form-item>
                <el-form-item label="科室 ID">
                    <el-input v-model="updateForm.departmentId" type="number"></el-input>
                </el-form-item>
                <el-form-item label="电话号码">
                    <el-input v-model="updateForm.phonenumber"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isUpdateDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitUpdate">提交更新</el-button>
            </template>
        </el-dialog>
        <!-- 添加医生对话框 -->
        <el-dialog v-model="isAddDoctorDialogVisible" title="添加医生" width="500px">
            <el-form :model="addDoctorForm" label-width="120px">
                <el-form-item label="用户名" required>
                    <el-input v-model="addDoctorForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" required>
                    <el-input v-model="addDoctorForm.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" required>
                    <el-input v-model="addDoctorForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="科室 ID" required>
                    <el-input v-model="addDoctorForm.departmentId" type="number" placeholder="请输入科室 ID"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" required>
                    <el-input v-model="addDoctorForm.phonenumber" placeholder="请输入电话号码"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="isAddDoctorDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAddDoctor">提交添加</el-button>
            </template>
        </el-dialog>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParams.page" :page-sizes="[10, 20, 30]" :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="doctorList.total"></el-pagination>


    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDoctorList, updateDoctorInfoServe, addDoctorServe, deleteDoctorInfoServe } from '@/api/user';
import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';

// 搜索参数
const searchParams = ref({
    page: 1,
    pageSize: 10,
    name: '',
    departmentId: ''
});

// 医生列表数据
const doctorList = ref({
    total: 0,
    records: []
});
// 更新表单
const updateForm = ref({
    doctorId: 0,
    username: '',
    password: '',
    name: '',
    departmentId: 0,
    phonenumber: ''
});
// 更新表单
const isUpdateDialogVisible = ref(false);
// 添加医生对话框显示状态
const isAddDoctorDialogVisible = ref(false);
// 添加医生表单数据
const addDoctorForm = ref({
    username: '',
    password: '',
    name: '',
    departmentId: 0,
    phonenumber: ''
});
// 获取医生列表
const fetchDoctorList = async () => {
    try {
        const res = await getDoctorList(searchParams.value);
        if (res.status === 200) {
            doctorList.value = res.data.data;
        } else {
            console.error('获取数据失败', res.msg);
        }
    } catch (error) {
        console.error('请求错误', error);
    }
};

// 处理每页数量变化
const handleSizeChange = (newSize) => {
    searchParams.value.pageSize = newSize;
    fetchDoctorList();
};

// 处理页码变化
const handleCurrentChange = (newPage) => {
    searchParams.value.page = newPage;
    fetchDoctorList();
};

// 打开更新对话框并填充数据
const handleUpdate = (row) => {
    updateForm.value = {
        doctorId: row.doctorId,
        username: row.username || '',
        password: row.password || '',
        name: row.name || '',
        departmentId: row.departmentId || 0,
        phonenumber: row.phonenumber || ''
    };
    isUpdateDialogVisible.value = true;
};
// 提交更新
const submitUpdate = async () => {
    try {
        const res = await updateDoctorInfoServe(updateForm.value);
        if (res.status === 200) {
            console.log('医生信息更新成功', res.data);
            isUpdateDialogVisible.value = false;
            fetchDoctorList(); // 刷新列表
        } else {
            console.error('医生信息更新失败', res.msg);
        }
    } catch (error) {
        console.error('更新请求异常', error);
    }
};

// 打开添加医生对话框
const openAddDoctorDialog = () => {
    isAddDoctorDialogVisible.value = true;
};
// 提交添加医生信息
const submitAddDoctor = async () => {
    try {
        const res = await addDoctorServe(addDoctorForm.value);
        if (res.status === 200) {
            console.log('医生添加成功', res.data);
            isAddDoctorDialogVisible.value = false;
            addDoctorForm.value = {
                username: '',
                password: '',
                name: '',
                departmentId: 0,
                phonenumber: ''
            };
            fetchDoctorList(); // 刷新医生列表
        } else {
            console.error('医生添加失败', res.msg);
        }
    } catch (error) {
        console.error('添加医生请求异常', error);
    }
};
// 删除医生逻辑
const deleteDoctor = async (doctorId) => {
    try {
        const res = await deleteDoctorInfoServe(doctorId);
        if (res.status === 200) { // 假设成功码为1
            console.log(res.data); // 输出删除成功信息
            await fetchDoctorList(); // 刷新列表
        } else {
            console.error('删除失败', res.msg);
        }
    } catch (error) {
        console.error('删除请求异常', error);
    }
};


// 初始化加载
onMounted(() => {
    fetchDoctorList();
});
</script>

<style scoped>
::v-deep .el-table .cell {
    text-align: center;
}

.search-container {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
}

.el-pagination {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    gap: 10px;

}
</style>