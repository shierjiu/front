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
export const addAppointmentServe = ({
  appointmentDate,
  appointmentTimeSlot,
  appointmentNumber
}) => {
  console.log(localStorage.getItem('token'))
  return request.post('/doctor/saveAppointment', {
    appointmentDate,
    appointmentTimeSlot,
    appointmentNumber
  })
}
// 医生回显放号（分页）
export const doctorGetAppointmentListServe = ({ size, current }) => {
  if (size) {
    return request.get('/doctor/list')
  }
  return request.get(`/doctor/list?size=${size}&current=${current}`)
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
export const getMyAppointmentServe = () => request.get('/user/purchase')

// 患者取消预约
export const cancelAppointmentServe = () => request.put('/user/updatePurchase')

// 医生开始就诊患者
export const doctorStartDiagnoseServe = (contractAddress) =>
  request.get('/doctor/purchaseUser', { contractAddress })

// 医生结束就诊（添加病例）
export const doctorEndDiagnoseServe = ({
  userAddress,
  patientInfo,
  immediateCase,
  medicalHistory
}) => {
  return request.post('/doctor/endOfVisit', {
    userAddress,
    patientInfo,
    immediateCase,
    medicalHistory
  })
}
