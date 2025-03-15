<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { registerServe, loginServe } from '@/api/user'
import { ElMessage } from 'element-plus';
const router = useRouter()

// 获取科室列表
onMounted(() => {
  console.log('页面已挂载，脚本开始执行');
  // 监听 birthDate 变化
  watch(formModel, (newVal) => {
    if (newVal.birthDate) calculateAge();
  }, { deep: true });
})


// 切换登录注册
const dialogR = ref(false)

// 登录注册表单
const formModel = ref({
  username: '',
  password: '',
  name: '',
  gender: '',
  age: null,            // 用于存储最终计算的年龄
  phone: '',
  birthDate: '',         // 用户输入的出生日期
  role: 'user'  // 默认固定为 'user'
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' }
  ],
  birthDate: [
    { required: true, message: '请选择出生日期', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'blur' }
  ]
}
// 角色列表
const roleList = [
  { value: 'user', label: '患者' },
  { value: 'doctor', label: '医生' }
]

const formL = ref()
const formR = ref()
// 登录注册
const register = async () => {
  try {
    await formR.value.validate();
    const res = await registerServe(formModel.value);
    if (res.code === 200) {
      ElMessage.success('注册成功！');
      // 自动登录
      const loginRes = await loginServe({
        username: formModel.value.username,
        password: formModel.value.password,
        role: formModel.value.role
      });
      if (loginRes.code === 200) {
        const token = loginRes.data.data;
        localStorage.setItem('token', token);
        router.push(`/${formModel.value.role}`);
        ElMessage.success('登录成功！');
      } else {
        ElMessage.error(loginRes.msg || '自动登录失败，请手动登录');
      }
      dialogR.value = false;
    } else {
      ElMessage.error(res.msg || '注册失败，请稍后重试');
    }
  } catch (error) {
    console.error('注册请求出错:', error);
    ElMessage.error('注册请求出错，请检查网络');
  }
};
const login = async () => {
  try {
    await formL.value.validate();
    const res = await loginServe({
      username: formModel.value.username,
      password: formModel.value.password,
      role: formModel.value.role
    });
    console.log('登录请求返回:', res); // 添加调试信息
    if (res.status === 200) { // 假设返回码 200 表示成功
      const token = res.data.data;
      localStorage.setItem('token', token);
      // 新增日志：检查跳转路径、token存储、路由实例
      router.push(`/${formModel.value.role}`);
      ElMessage.success('登录成功！');
      // 临时固定跳转到 /user 测试
      // console.log('登录成功，跳转到 /user 页面');
      // router.push('/user');
      // ElMessage.success('登录成功！');
    } else {
      ElMessage.error(res.msg || '登录失败，请稍后重试');
    }
  } catch (error) {
    console.error('登录请求出错:', error);
    ElMessage.error('登录请求出错，请检查网络');
  }
};

// 监听 birthDate 变化自动计算年龄
const calculateAge = () => {
  if (formModel.value.birthDate) {
    const birth = new Date(formModel.value.birthDate);
    const today = new Date();
    formModel.value.age = today.getFullYear() - birth.getFullYear();
    if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) {
      formModel.value.age--;
    }
    console.log('计算得到的年龄:', formModel.value.age); // 添加调试信息
  }
};

// 清除数据
const close = () => {
  formModel.value.username = ''
  formModel.value.password = ''
  formModel.value.role = ''
  formModel.value.name = ''
  formModel.value.contractAddress = ''
  formModel.value.age = ''
  formModel.value.sex = ''
  formModel.value.departmentId = ''
}
const open = () => {
  formModel.value.username = ''
  formModel.value.password = ''
  // formModel.value.role = ''
}

</script>

<template>
  <el-row>
    <el-col class="loginbg" :span="12">
      <h1>医疗健康系统</h1>
    </el-col>
    <el-col class="loginform" :span="7" :offset="2">
      <el-form ref="formL" label-width="90px" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formModel.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formModel.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-select v-model="formModel.role" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" type="primary">登录</el-button>
        </el-form-item>
        <el-link @click="dialogR = true">没有账号？点击注册</el-link>
      </el-form>
    </el-col>
    <el-dialog @open="open" @close="close" v-model="dialogR">
      <el-form ref="formR" label-width="100px" :model="formModel" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formModel.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码：" prop="password">
          <el-input v-model="formModel.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别：" prop="gender">
          <el-select v-model="formModel.gender" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>


        <!-- 年龄 -->
        <el-form-item label="年龄：" prop="age">
          <el-input v-model.number="formModel.age" type="number" placeholder="年龄"></el-input>
        </el-form-item>

        <!-- 电话 -->
        <el-form-item label="电话：" prop="phone">
          <el-input v-model="formModel.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>

        <!-- 出生日期 -->
        <el-form-item label="出生日期：" prop="birthDate">
          <el-date-picker v-model="formModel.birthDate" type="date" placeholder="请选择出生日期" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>



        <el-form-item>
          <el-button @click="register" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<style scoped>
.loginbg {
  background-image: url('@/assets/login.jpg');
  background-size: cover;
  border-radius: 0 30px 30px 0;
}

.loginform {
  margin-top: 250px;
}

.el-row {
  height: 100vh;
}

.el-form {
  padding: 20px 50px 50px 25px;
  background-color: white;
  border-radius: 30px;
}

.el-button {
  width: 100%;
}

.el-link {
  float: right;
}
</style>