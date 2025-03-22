<template>
    <el-card>
        <div class="appointment-list">
            <h1>预约列表</h1>
            <!-- 查询表单 -->
            <div class="search-form">
                <input v-model="filters.userName" placeholder="用户名" />
                <el-select v-model="filters.status" placeholder="请选择状态" style="width: 150px;">
                    <el-option label="已预约" :value="3"></el-option>
                    <el-option label="已取消" :value="1"></el-option>
                    <el-option label="已完成" :value="2"></el-option>
                </el-select>
                <input v-model="filters.startDate" type="date" placeholder="开始日期" />
                <input v-model="filters.endDate" type="date" placeholder="结束日期" />
                <button @click="searchAppointments">搜索</button>
            </div>
            <!-- 数据表格 -->
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>用户名</th>
                        <th>状态</th>
                        <th>日期</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in appointmentList" :key="item.appointmentId">
                        <td>{{ item.appointmentId }}</td>
                        <td>{{ item.userName }}</td>
                        <!-- 显示状态对应的文本 -->
                        <td>{{ item.status }}</td>
                        <td>{{ item.appointmentDate }}</td>
                    </tr>
                    <tr v-if="appointmentList.length === 0">
                        <td colspan="4">暂无数据</td>
                    </tr>
                </tbody>
            </table>
            <!-- 分页控件 -->
            <div class="pagination">
                <button :disabled="pagination.page === 1" @click="changePage(pagination.page - 1)">上一页</button>
                <span>第 {{ pagination.page }} 页 / 共 {{ totalPages }} 页</span>
                <button :disabled="pagination.page === totalPages" @click="changePage(pagination.page + 1)">下一页</button>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { adminGetAppointmentList } from '@/api/user'; // 引入查询接口

// 查询条件
const filters = reactive({
    userName: '',
    status: 1,
    startDate: '',
    endDate: ''
});

// 分页数据
const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
});

// 预约列表数据
const appointmentList = ref([]);

// 根据总条数计算总页数
const totalPages = computed(() => Math.ceil(pagination.total / pagination.pageSize));

// 获取预约列表数据
const fetchAppointments = () => {
    adminGetAppointmentList({
        userName: filters.userName,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: pagination.page,
        pageSize: pagination.pageSize
    })
        .then(res => {
            const data = res.data.data;
            console.log('获取预约列表成功：', data.records);
            appointmentList.value = data.records || [];
            pagination.total = data.total;
        })
        .catch(error => {
            console.error('获取预约列表失败：', error);
        });
};

// 点击搜索时，重置页码并获取数据
const searchAppointments = () => {
    pagination.page = 1;
    fetchAppointments();
};

// 切换页码
const changePage = (newPage) => {
    pagination.page = newPage;
    fetchAppointments();
};

// 组件加载时自动查询
onMounted(() => {
    fetchAppointments();
});
</script>

<style scoped>
.appointment-list {
    padding: 20px;
}

.search-form {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-form input,
.search-form button {
    padding: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

table,
th,
td {
    border: 1px solid #ccc;
}

th,
td {
    padding: 8px;
    text-align: left;
}

.pagination {
    display: flex;
    align-items: center;
}

.pagination button {
    padding: 5px 10px;
    margin-right: 10px;
}
</style>