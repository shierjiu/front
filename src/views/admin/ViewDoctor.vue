<template>
    <el-card>
        <!-- 搜索框 -->
        <div class="search-container">
            <el-input v-model="searchParams.name" placeholder="请输入医生姓名" @keyup.enter="fetchDoctorList"></el-input>
            <el-input v-model="searchParams.department" placeholder="请输入科室名称" @keyup.enter="fetchDoctorList"></el-input>
            <el-button type="primary" @click="fetchDoctorList">搜索</el-button>
        </div>

        <!-- 医生列表 -->
        <el-table :data="doctorList.records" stripe>
            <el-table-column prop="doctorId" label="医生 ID" align="center" header-align="center"></el-table-column>
            <el-table-column prop="name" label="医生姓名" align="center" header-align="center"></el-table-column>
            <el-table-column prop="departmentId" label="所属科室Id" align="center" header-align="center"></el-table-column>
            <!-- 可根据实际数据结构添加更多列 -->
        </el-table>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParams.page" :page-sizes="[10, 20, 30]" :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="doctorList.total"></el-pagination>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDoctorList } from '@/api/user';
import { ElInput, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';

// 搜索参数
const searchParams = ref({
    page: 1,
    pageSize: 10,
    name: '',
    department: ''
});

// 医生列表数据
const doctorList = ref({
    total: 0,
    records: []
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