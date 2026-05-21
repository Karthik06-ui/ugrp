import api from './axios'

export const getStudentProfile  = ()     => api.get('/auth/profile/student/')
export const updateStudentProfile = (d)  => api.patch('/auth/profile/student/', d)

export const getMentorProfile   = ()     => api.get('/auth/profile/mentor/')
export const updateMentorProfile  = (d)  => api.patch('/auth/profile/mentor/', d)