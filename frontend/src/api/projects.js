import api from './axios'

export const listProjects   = ()       => api.get('/projects/')
export const getProject     = (id)     => api.get(`/projects/${id}/`)
export const createProject  = (data)   => api.post('/projects/', data)
export const updateProject  = (id, d)  => api.patch(`/projects/${id}/`, d)
export const deleteProject  = (id)     => api.delete(`/projects/${id}/`)