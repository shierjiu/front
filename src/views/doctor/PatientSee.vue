<template>
    <div>hello world</div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { getConsultation } from '@/api/user';
import { ElMessage } from 'element-plus';

const consultationList = ref([]);

const fetchConsultation = async () => {
    try {
        const response = await getConsultation();
        console.log(response);
        if (response.data.code === 1) {
            consultationList.value = response.data.data.records;
        } else {
            ElMessage.error(response.data.msg || '获取咨询数据失败');
        }
    } catch (error) {
        ElMessage.error('请求出错，请稍后重试');
    }
};

onMounted(() => {
    fetchConsultation();
});
</script>

<style scoped></style>