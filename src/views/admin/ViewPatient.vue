<template>
    <el-card>
        <div class="user-list-container">
            <h2>用户列表</h2>
            <!-- 筛选表单和分页 -->
            <div class="filter-pagination-container">
                <form class="filter-form">
                    <div class="form-group">
                        <el-date-picker v-model="filterParams.startDate" type="date" placeholder="选择开始日期" />
                    </div>
                    <div class="form-group">
                        <el-date-picker v-model="filterParams.endDate" type="date" placeholder="选择结束日期" />
                    </div>
                    <div class="form-group">
                        <label>姓名：</label>
                        <el-input v-model="filterParams.name" placeholder="请输入姓名" />
                    </div>
                    <div class="form-group">
                        <label>性别：</label>
                        <el-select v-model="filterParams.gender" placeholder="请选择性别">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </div>
                    <el-button type="primary" @click="fetchUserList">查询</el-button>
                </form>
                <!-- 分页 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="filterParams.page" :page-sizes="[10, 20, 30]" :page-size="filterParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="userList.total">
                </el-pagination>
            </div>
            <!-- 用户表格 -->
            <el-table :data="userList.records" stripe>
                <el-table-column prop="userId" label="用户ID"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="phone" label="电话"></el-table-column>
                <el-table-column prop="birthDate" label="出生日期"></el-table-column>
                <el-table-column prop="createdDate" label="创建日期"></el-table-column>
            </el-table>
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserList } from '@/api/user';
import { ElDatePicker, ElInput, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';

// 过滤参数
const filterParams = ref({
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: '',
    name: '',
    gender: ''
});

// 用户列表数据
const userList = ref({
    total: 0,
    records: []
});

// 获取用户列表
const fetchUserList = async () => {
    try {
        const res = await getUserList(filterParams.value);
        console.log(res);
        if (res.status === 200) {
            userList.value = res.data.data;
            console.log('获取数据成功', userList.value);
        } else {
            console.error('获取数据失败', res.msg);
        }
    } catch (error) {
        console.error('请求错误', error);
    }
};
// 处理每页数量变化
const handleSizeChange = (newSize) => {
    filterParams.value.pageSize = newSize;
    fetchUserList();
};

// 处理页码变化
const handleCurrentChange = (newPage) => {
    filterParams.value.page = newPage;
    fetchUserList();
};

// 初始化加载
onMounted(() => {
    fetchUserList();
});
</script>

<style scoped>
::v-deep .el-table .cell {
    text-align: center;
}

.user-list-container {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.user-list-container h2 {
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 18px;
}

/* 筛选和分页区域容器 */
.filter-pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin-bottom: 16px;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 4px;
}

/* 筛选表单 */
.filter-form {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 600px;
    flex-shrink: 0;

}

.form-group {
    display: flex;
    align-items: center;
}

.form-group label {
    margin-right: 8px;
    font-weight: 500;
}

.el-pagination {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    gap: 10px;
    /* 子元素间距 */
}

.el-pagination__total {
    margin-right: 5px;
    /* 总数与其他元素的间距 */
}

.el-pagination__sizes {
    margin-right: 5px;
    /* 下拉框与其他元素的间距 */
}

.el-pagination__btn-group {
    display: flex;
    /* 按钮组也用 flex 确保按钮在一行 */
    gap: 5px;
    /* 按钮间间距 */
}

/* 用户表格 */
.el-table {
    margin-top: 16px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
}

.el-pager {
    display: flex;
}

.el-table th,
.el-table td {
    text-align: center;
}

.el-table th {
    background-color: #fafafa;
    font-weight: 600;
}

/* 响应式处理：屏幕较小时允许横向滚动 */
@media (max-width: 1200px) {
    .filter-pagination-container {
        overflow-x: auto;
    }

    .filter-form {
        min-width: auto;
        /* 小屏幕取消最小宽度限制 */
    }
}
</style>
