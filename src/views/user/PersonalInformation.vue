<template>
    <el-card>
        <div class="user-info-container">
            <h1 class="title">用户信息</h1>
            <div v-if="userInfo" class="info-content">
                <p><span class="label">用户 ID:</span> {{ userInfo.userId }}</p>
                <p><span class="label">用户名:</span> {{ userInfo.username }}</p>
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
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserInfo } from '@/api/user';
import { ElMessage } from 'element-plus';
// 修改导入语句，使用命名导入
import { jwtDecode } from 'jwt-decode';

const userInfo = ref(null);
const errorMsg = ref('');
const userId = ref(null);
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
</style>