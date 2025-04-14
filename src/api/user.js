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

//医生获得治疗方案
export const getCurrentIllnessWithTreatmentPlanServe = () => {
  let url = '/consultation/CurrentIllnessWithTreatmentPlan'
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
export const addAppointment = (slotId, age, gender, allergies, symptoms) => {
  const data = {
    slotId,
    age,
    gender,
    allergies,
    symptoms
  }
  return request.post('/appointment', data)
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
//患者病历查询
export const getConsultationRecordListServe = (token) => {
  return request.get('/user/ConsultationRecordList', {
    headers: {
      token
    }
  })
}

//医生 保存就诊信息接口
export const saveConsultationServe = (params) => {
  return request.post('/consultation', params)
}

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
//查看详细信息
export const getDetailedConsultation = (id) => {
  return request.get(`/consultation/basis/${id}`)
}
// 获取预约时段信息接口
export const getAppointmentSlotInfo = () => {
  return request.get('/appointmentSlot')
}

//医生获取部门列表接口
export const getDepartmentList = () => {
  return request.get('/department/departmentList')
}

//管理员查询患者
export const getUserList = (params = {}) => {
  return request.get('/admin/userList', {
    params: {
      page: params.page || '',
      pageSize: params.pageSize || '',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      name: params.name || '',
      gender: params.gender || ''
    }
  })
}

//管理员查询医生
export const getDoctorList = (params = {}) => {
  return request.get('/admin/doctorList', {
    params: {
      page: params.page || 1, // 页码，默认1
      pageSize: params.pageSize || 10, // 每页数量，默认10
      name: params.name || '', // 医生姓名（可选搜索）
      departmentId: params.departmentId || '' // 科室ID（可选过滤）
    }
  })
}

//admin更新医生
export const updateDoctorInfoServe = (params) => {
  return request.put('/admin/doctorInfo', params)
}

//admin添加医生
export const addDoctorServe = (params) => {
  return request.post('/admin/addDoctor', params)
}

//admin删除医生
export const deleteDoctorInfoServe = (doctorId) => {
  return request.delete(`/admin/doctorInfo/${doctorId}`)
}

//管理员查询预约
export const adminGetAppointmentList = (params = {}) => {
  return request.get('/admin/appointmentList', {
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      userName: params.userName || '',
      status: params.status || '',
      startDate: params.startDate || '',
      endDate: params.endDate || ''
    }
  })
}

//admin查看科室
export const findGetDepartmentServe = (id) => request.get(`/department/${id}`)

// 管理员查询治疗记录
export const getTreatmentListServe = (params = {}) => {
  return request.get('/admin/treatmentList', {
    params: {
      page: params.page || '',
      pageSize: params.pageSize || '',
      doctorName: params.doctorName || '',
      userName: params.userName || '',
      startDate: params.startDate || '',
      endDate: params.endDate || ''
    }
  })
}

//admin更新科室
// 更新科室接口
export const updateDepartmentServe = (params) => {
  return request.put('/department', params)
}
//admin添加科室
// 添加科室接口
export const addDepartmentServe = (params) => {
  return request.post('/department', params)
}

// 删除科室接口
export const deleteDepartmentServe = (id) => {
  return request.delete(`/department/${id}`)
}

// 修改治疗方案
export const updateTreatmentPlanServe = (params) => {
  return request.put('/admin/updateTreatmentPlan', params)
}
// 修改病情方案
export const medicalConditionDescription = (params) => {
  return request.put('/admin/updateCurrentIllness', params)
}

//添加治疗方案
export const saveTreatmentPlanServe = (data) => {
  return request.post('/admin/saveTreatmentPlan', data)
}
//添加病情方案
export const saveCurrentIllnessServe = (data) => {
  return request.post('/admin/saveCurrentIllness', data)
}

// 删除治疗方案
export const removeTreatmentPlanServe = (id) => {
  return request.delete(`/admin/removeTreat/${id}`)
}
// 删除病情方案
export const removeCurrentIllnessServe = (id) => {
  return request.delete(`/admin/removeCurrent/${id}`)
}
