<template>
    <el-container>
        <el-header>
            <h1>健康医疗系统</h1>
            <el-link @click="logout">退出</el-link>
        </el-header>
        <el-container>
            <el-aside>
                <el-menu router :default-active="$route.path">
                    <el-menu-item index="/admin/viewdoctor">查看医生</el-menu-item>
                    <el-menu-item index="/admin/viewpatient">查看患者</el-menu-item>
                    <el-menu-item index="/admin/viewappointment">查看问诊</el-menu-item>
                    <el-menu-item index="/admin/viewmedicalrecord">查看预约</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus';
const router = useRouter()
// 退出登录
const logout = async () => {
    await ElMessageBox.confirm('您确认退出吗？', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })
    localStorage.setItem('token', '')
    router.push('/login')
}
</script>



<style scoped>
.el-aside {
    padding-left: 20px;
    width: 15vh;
    height: calc(100vh - 80px);
    background-color: white;
}

.el-header {
    height: 80px;
    background-color: rgb(79, 132, 242);
}

.el-header h1 {
    float: left;
    color: white;
    line-height: 80px;
    margin-left: 100px;
    width: 500px;
}

.el-header .el-link {
    font-size: 20px;
    float: right;
    color: white;
    line-height: 80px;
    width: 200px;
}
</style>