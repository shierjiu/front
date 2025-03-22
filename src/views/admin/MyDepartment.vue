<template>
    <el-card>
        <!-- 输入框和查询按钮 -->
        <div>
            <el-input v-model="queryDepartmentId" placeholder="请输入科室 ID"></el-input>
            <el-button @click="queryDepartment">查询</el-button>
        </div>
        <!-- 显示查询结果 -->
        <div v-for="item in departmentList" :key="item.departmentId">
            <p>科室 ID：{{ item.departmentId }}</p>
            <p>科室名称：{{ item.departmentName }}</p>
            <p>描述：{{ item.description }}</p>
            <hr>
        </div>
    </el-card>
</template>

<script setup>
import { getDepartmentList, findGetDepartmentServe } from '@/api/user';
import { ref } from 'vue';

const departmentList = ref([]);
const queryDepartmentId = ref('');

// 查询科室列表
const fetchDepartmentList = async () => {
    try {
        const res = await getDepartmentList();
        if (res.status === 200) {
            departmentList.value = res.data.data.records;
            console.log('获取科室数据成功', departmentList.value);
        } else {
            console.error('获取科室数据失败', res.msg);
        }
    } catch (error) {
        console.error('接口请求错误', error);
    }
};

// 根据 departmentId 查询科室
const queryDepartment = async () => {
    if (queryDepartmentId.value) {
        try {
            const res = await findGetDepartmentServe(queryDepartmentId.value);
            if (res.status === 200) {
                // 假设返回单条数据，将其放入数组中显示
                departmentList.value = [res.data.data];
                console.log('查询科室数据成功', departmentList.value);
            } else {
                console.error('查询科室数据失败', res.msg);
            }
        } catch (error) {
            console.error('接口请求错误', error);
        }
    } else {
        // 若未输入 ID，则查询全部列表
        await fetchDepartmentList();
    }
};

// 组件挂载时查询全部列表
fetchDepartmentList();
</script>

<style scoped>
/* 可根据需求添加样式 */
</style>