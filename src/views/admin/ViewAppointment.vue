<template>
    <el-card class="treatment-list-card">
        <div class="record-list">
            <ul>
                <li v-for="record in treatmentList" :key="record.recordId">
                    <span class="record-id">记录ID: {{ record.recordId }}</span>
                    <span class="doctor-name">医生姓名: {{ record.doctorName }}</span>
                    <span class="user-name">用户姓名: {{ record.userName }}</span>
                </li>
            </ul>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="totalRecords" class="pagination">
        </el-pagination>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTreatmentListServe } from '@/api/user';

const treatmentList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);

const fetchTreatmentList = async () => {
    try {
        const res = await getTreatmentListServe({
            page: currentPage.value,
            pageSize: pageSize.value
        });
        if (res.status === 200) {
            treatmentList.value = res.data.data.records;
            totalRecords.value = res.data.data.total; // 假设接口返回总记录数
            console.log('treatmentList', treatmentList.value);
        }
    } catch (error) {
        console.error('接口请求错误', error);
    }
};

const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
    currentPage.value = 1;
    fetchTreatmentList();
};

const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    fetchTreatmentList();
};

onMounted(() => {
    fetchTreatmentList();
});
</script>

<style scoped>
.treatment-list-card {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.record-list {
    margin-bottom: 20px;
}

.record-list ul {
    list-style-type: none;
    padding: 0;
}

.record-list li {
    padding: 10px;
    border-bottom: 1px solid #eaeaea;
    transition: background-color 0.3s;
}

.record-list li:hover {
    background-color: #f9f9f9;
}

.record-id,
.doctor-name,
.user-name {
    display: inline-block;
    margin-right: 20px;
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>