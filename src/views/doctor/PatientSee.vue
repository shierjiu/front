<template>
    <el-card>
        <el-button @click="handleButtonClick">开始问诊</el-button>
        <!-- 有数据时遍历渲染 -->
        <div v-if="consultationList.length > 0">
            <div v-for="item in consultationList" :key="item.appointmentId" class="consultation-item">
                预约 ID：{{ item.appointmentId }}
                用户 ID：{{ item.userId }}
                预约日期：{{ item.appointmentDate }}
            </div>
        </div>
        <!-- 无数据时显示提示 -->
        <div v-else class="no-data-tip">
            {{ response.data && response.data.msg || '暂无预约数据' }}
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getConsultation } from '@/api/user';
import { ElMessage } from 'element-plus';

const consultationList = ref([]);
// 初始化 response 对象
const response = ref({ data: {} });

const fetchConsultation = async () => {
    try {
        const res = await getConsultation();
        response.value = res;
        if (res.data.code === 1) {
            consultationList.value = res.data.data.records || [];
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    }
};

const handleButtonClick = () => {
    console.log('开始问诊');
};
onMounted(() => {
    fetchConsultation();
});
</script>

<style scoped>
.consultation-item {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.no-data-tip {
    color: #666;
    padding: 12px 0;
}
</style>