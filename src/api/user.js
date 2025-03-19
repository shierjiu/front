import request from '@/utils/request'

// 获取科室列表
export const getDepartmentListServe = () => request.get('/doctor/departmentList')

// 注册接口
export const registerServe = ({
  username,
  password,
  name,
  gender,
  age,
  phone,
  birthDate,
  role
}) => {
  const data = {
    username,
    password,
    name,
    gender,
    age,
    phone,
    birthDate
  }
  return request.post(`/registered/${role}`, data)
}

// 登录接口
export const loginServe = ({ username, password, role }) =>
  request.post(`/login/${role}`, { username, password })

// 医生放号接口
export const appointmentSlot = ({ session, remainingCount }) => {
  console.log(localStorage.getItem('token'))
  // 检查 session 是否为合法值
  if (session !== '上午' && session !== '下午') {
    return Promise.reject(new Error('预约时间只能是上午或者下午'))
  }
  // 检查 remainingCount 是否为非负数
  if (remainingCount < 0) {
    return Promise.reject(new Error('放号数不能为负数'))
  }
  // 发送 POST 请求（移除 headers 参数）
  return request
    .post('/appointmentSlot', {
      session,
      remainingCount
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('请求出错:', error)
      throw error
    })
}

// 医生回显放号（分页）
export const doctorGetAppointmentListServe = ({ size, current }) => {
  let url = '/appointmentSlot'
  if (size && current) {
    url += `?size=${size}&current=${current}`
  }
  return request.get(url)
}

// 获取医生列表
export const getDoctorListServe = () => request.get('/appointmentSlot/appointmentslotList')

// 患者查询科室
export const searchDepartmentServe = (name) =>
  request.get(`/doctor/DoctorList?departmentName=${name}`)

// 患者预约挂号
export const registrationServe = ({
  id,
  name,
  departmentName,
  appointmentDate,
  appointmentTimeSlot,
  appointmentNumber
}) => {
  return request.put('/user/purchase', {
    id,
    name,
    departmentName,
    appointmentDate,
    appointmentTimeSlot,
    appointmentNumber
  })
}

// 患者查看病例
export const getCaseServe = () => request.get('/user/userInfo')

// 患者获取我的预约
export const addAppointment = (slotId) => {
  return request.post('/appointment', { slotId })
}

// 患者获取我的预约
export const getMyAppointmentServe = () => request.get('/appointment')

// 患者取消预约
export const updateAppointmentStatus = (appointmentId) => {
  return request.put('/appointment', {
    appointmentId
  })
}

//患者回显个人信息
export const getUserInfo = (userId) => {
  return request.get(`/user/${userId}`)
}

// 更新用户信息
export const changeInfoUser = ({
  userId,
  username,
  password,
  name,
  gender,
  age,
  phone,
  birthDate,
  createdDate
}) => {
  return request.put('/user/changeInfoUser', {
    userId,
    username,
    password,
    name,
    gender,
    age,
    phone,
    birthDate,
    createdDate
  })
}
// 患者获取预约时段列表接口（按科室名称查询）
export const getAppointmentSlotListByDeptName = (departmentName) => {
  return request.get('/appointmentSlot/appointmentslotList', {
    params: { departmentName } // 参数是一个字符串
  })
}

// 医生开始就诊患者
export const doctorStartDiagnoseServe = (contractAddress) =>
  request.get('/doctor/purchaseUser', { contractAddress })

// 医生更新就诊
export const updateAppointmentSlot = ({ slotId, session, remainingCount }) => {
  return request.put('/appointmentSlot', {
    slotId,
    session,
    remainingCount
  })
}
// 医生查看患者
export const getConsultation = (params) => {
  return request.get('/consultation', { params })
}

// 获取预约时段信息接口
export const getAppointmentSlotInfo = () => {
  return request.get('/appointmentSlot')
}

//医生获取部门列表接口
export const getDepartmentList = () => {
  return request.get('/department/departmentList')
}
