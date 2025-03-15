<template>
    <div>
        111
    </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { getDoctorListServe } from '@/api/user'
onMounted(async () => {
    try {
        console.log('页面加载完成');
        const res = await getDoctorListServe(); // 使用 await 等待结果
        console.log('接口响应数据：', res.data); // 打印具体数据
    } catch (error) {
        console.error('接口调用失败：', error);
    }
});

</script>