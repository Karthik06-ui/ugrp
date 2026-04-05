import api from './axios'

export const getMyEnrollments = () => api.get('/student/enrollments/')