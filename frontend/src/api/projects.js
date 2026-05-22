import api from './axios'

function buildProjectFormData(data) {
  const form = new FormData()
  if (data.title !== undefined) form.append('title', data.title)
  if (data.description !== undefined) form.append('description', data.description)
  if (data.status !== undefined) form.append('status', data.status)
  if (data.project_type !== undefined) form.append('project_type', data.project_type)
  if (data.industry_name !== undefined) form.append('industry_name', data.industry_name || '')
  if (data.deadline !== undefined) form.append('deadline', data.deadline || '')
  
  if (data.document !== undefined) {
    if (data.document === null) {
      form.append('document', '')
    } else {
      form.append('document', data.document)
    }
  }
  return form
}

export const listProjects   = ()       => api.get('/projects/')
export const getProject     = (id)     => api.get(`/projects/${id}/`)

export const createProject  = (data)   => {
  const form = buildProjectFormData(data)
  return api.post('/projects/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateProject  = (id, data) => {
  const form = buildProjectFormData(data)
  return api.patch(`/projects/${id}/`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteProject  = (id)     => api.delete(`/projects/${id}/`)