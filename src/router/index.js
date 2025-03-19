import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/login/LoginPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/user',
      redirect: '/user/getnum',
      component: () => import('@/views/user/indexV.vue'),
      children: [
        { path: '/user/getnum', component: () => import('@/views/user/GetNumber.vue') },
        { path: '/user/appointment', component: () => import('@/views/user/MyAppointment.vue') },
        { path: '/user/case', component: () => import('@/views/user/MyCase.vue') },
        { path: '/user/my-test', component: () => import('@/views/user/myTest.vue') }, // 新增子路由
        {
          path: '/user/personalinformation',
          component: () => import('@/views/user/PersonalInformation.vue')
        } // 新增子路由
      ]
    },
    {
      path: '/doctor',
      redirect: '/doctor/addnum',
      component: () => import('@/views/doctor/indexV.vue'), // 修正父路由导入
      children: [
        {
          path: '/doctor/addnum',
          component: () => import('@/views/doctor/AddNumber.vue') // 修正子路由导入语法
        },
        {
          path: '/doctor/patientsee',
          component: () => import('@/views/doctor/PatientSee.vue') // 修正子路由导入语法
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  if (to.path !== '/login' && !localStorage.getItem('token')) {
    return '/login'
  }
  return
})

export default router
