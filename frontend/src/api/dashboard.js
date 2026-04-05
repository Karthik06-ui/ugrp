import api from './axios'

// Dashboards
export const getStudentDashboard = ()       => api.get('/student/dashboard/')
export const getMentorDashboard  = ()       => api.get('/mentor/dashboard/')

// Tasks
export const createTask     = (data)        => api.post('/tasks/', data)
export const listTasks      = (params = {}) => api.get('/tasks/list/', { params })
export const getTask        = (id)          => api.get(`/tasks/${id}/`)
export const updateTask     = (id, data)    => api.patch(`/tasks/${id}/`, data)
export const deleteTask     = (id)          => api.delete(`/tasks/${id}/`)

// Reviews
export const createReview   = (data)        => api.post('/reviews/', data)
export const listReviews    = (params = {}) => api.get('/reviews/list/', { params })
export const updateReview   = (id, data)    => api.patch(`/reviews/${id}/`, data)

// Remarks
export const createRemark   = (data)        => api.post('/remarks/', data)
export const listRemarks    = (params = {}) => api.get('/remarks/list/', { params })
export const deleteRemark   = (id)          => api.delete(`/remarks/${id}/`)