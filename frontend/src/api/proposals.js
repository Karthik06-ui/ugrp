import api from './axios'

export const getStudentProposals   = (params = {}) => api.get('/proposals/list/', { params })
export const getMentorProposals    = (params = {}) => api.get('/mentor/proposals/', { params })
export const updateProposalStatus  = (id, data)    => api.patch(`/proposals/${id}/`, data)

/**
 * submitProposal — multipart/form-data with all applicant fields + file
 */
export function submitProposal(data) {
  const form = new FormData()
  form.append('project', data.project)
  form.append('message', data.message)
  // Applicant detail fields
  if (data.applicant_name)       form.append('applicant_name',       data.applicant_name)
  if (data.applicant_roll_no)    form.append('applicant_roll_no',    data.applicant_roll_no)
  if (data.applicant_contact)    form.append('applicant_contact',    data.applicant_contact)
  if (data.applicant_email)      form.append('applicant_email',      data.applicant_email)
  if (data.applicant_department) form.append('applicant_department', data.applicant_department)
  if (data.applicant_year)       form.append('applicant_year',       data.applicant_year)
  // File
  if (data.attachment)           form.append('attachment',           data.attachment)

  return api.post('/proposals/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}