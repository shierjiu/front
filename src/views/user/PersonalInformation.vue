<template>
    <el-card>
        <div class="user-info-container">
            <h1 class="title">用户信息</h1>
            <div v-if="userInfo" class="info-content">
                <p><span class="label">用户 ID:</span> {{ userInfo.userId }}</p>
                <p><span class="label">用户账号:</span> {{ userInfo.username }}</p>
                <p><span class="label">姓名:</span> {{ userInfo.name }}</p>
                <p><span class="label">性别:</span> {{ userInfo.gender }}</p>
                <p><span class="label">年龄:</span> {{ userInfo.age }}</p>
                <p><span class="label">电话:</span> {{ userInfo.phone }}</p>
                <p><span class="label">出生日期:</span> {{ userInfo.birthDate }}</p>
                <p><span class="label">创建日期:</span> {{ userInfo.createdDate }}</p>
            </div>
            <div v-else class="error-message">
                <p>{{ errorMsg }}</p>
            </div>
        </div>
        <el-button type="primary" @click="handleEditInfo">修改个人信息</el-button>
    </el-card>

    <!-- 新增：编辑用户信息的对话框 -->
    <el-dialog title="编辑用户信息" v-model="editDialogVisible" width="600px" append-to-body>
        <el-form :model="editForm" label-width="100px">
            <!-- 用户 ID：禁止修改 -->
            <el-form-item label="用户ID">
                <el-input v-model="editForm.userId" disabled></el-input>
            </el-form-item>
            <!-- 创建日期：禁止修改 -->
            <el-form-item label="创建日期">
                <el-input v-model="editForm.createdDate" disabled></el-input>
            </el-form-item>
            <!-- 其余信息可编辑 -->
            <el-form-item label="用户账号">
                <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="editForm.gender"></el-input>
            </el-form-item>
            <el-form-item label="年龄">
                <el-input v-model="editForm.age"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-input v-model="editForm.birthDate"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="editForm.password"></el-input>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEditForm">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserInfo, changeInfoUser } from '@/api/user';
import { ElMessage } from 'element-plus';
// 修改导入语句，使用命名导入
import { jwtDecode } from 'jwt-decode';

const userInfo = ref(null);
const errorMsg = ref('');
const userId = ref(null);
/** 控制“编辑对话框”显示或隐藏 */
const editDialogVisible = ref(false);
/** 编辑时用的表单数据（跟弹窗里双向绑定） */
const editForm = ref({
    userId: '',
    username: '',
    password: '', // 密码可选，如果需要修改可在弹框中加一个 <el-input type="password" ... >
    name: '',
    gender: '',
    age: null,
    phone: '',
    birthDate: '',
    createdDate: ''
});

const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // 改为取 id 字段
            userId.value = decodedToken.id;
            console.log('当前用户的 userId:', userId.value);
        } catch (error) {
            errorMsg.value = '解析 Token 出错，请重新登录';
            ElMessage.error('解析 Token 出错，请重新登录');
        }
    } else {
        errorMsg.value = '未找到 Token，请重新登录';
        ElMessage.error('未找到 Token，请重新登录');
    }
};

const fetchUserInfo = async () => {
    if (userId.value) {
        try {
            const response = await getUserInfo(userId.value);
            if (response.data.code === 1) {
                userInfo.value = response.data.data;
            } else {
                errorMsg.value = response.data.msg;
                ElMessage.error(response.data.msg || '获取用户信息失败');
            }
        } catch (error) {
            errorMsg.value = '请求出错，请稍后重试';
            ElMessage.error('请求出错，请稍后重试');
        }
    } else {
        errorMsg.value = '未获取到用户 ID，请重新登录';
        ElMessage.error('未获取到用户 ID，请重新登录');
    }
};

// === 新增：点击“修改个人信息”按钮后，填充弹窗的编辑表单 ===
const handleEditInfo = () => {
    if (!userInfo.value) {
        ElMessage.error('未能获取用户信息，无法编辑');
        return;
    }
    // 把当前 userInfo 复制到 editForm 中，弹出对话框供编辑
    editForm.value = {
        userId: userInfo.value.userId,
        username: userInfo.value.username,
        password: '', // 初始设为空，如果需要编辑密码再加对应的UI
        name: userInfo.value.name,
        gender: userInfo.value.gender,
        age: userInfo.value.age,
        phone: userInfo.value.phone,
        birthDate: userInfo.value.birthDate,
        createdDate: userInfo.value.createdDate
    };
    editDialogVisible.value = true;
};

// === 新增：用户点击对话框底部“确定”按钮，调用后端接口完成更新 ===
const submitEditForm = async () => {
    try {
        // 调用接口，把 editForm 中的内容传到后端
        const response = await changeInfoUser(editForm.value);

        // 注意：这里假设后端返回结构为 { code: 1, msg: null, data: "更新成功" }
        if (response.data.code === 1) {
            ElMessage.success('用户信息修改成功');
            editDialogVisible.value = false;

            // 如果需要在修改后立刻刷新用户信息：
            await fetchUserInfo();
        } else {
            ElMessage.error(response.data.msg || '修改失败，请检查参数');
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    }
};


onMounted(async () => {
    getUserIdFromToken();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fetchUserInfo();
});
</script>

<style scoped>
.user-info-container {
    max-width: 600px;
    margin: 30px auto;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.title {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
}

.info-content {
    padding: 10px;
}

.label {
    display: inline-block;
    width: 120px;
    font-weight: bold;
    color: #666;
}

.error-message {
    text-align: center;
    color: #ff0000;
    padding: 10px;
}

.el-button {
    margin-top: 20px;
}
</style>