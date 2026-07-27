import api from './axios'

export const getStudentProposals   = (params = {}) => api.get('/proposals/list/', { params })
export const getMentorProposals    = (params = {}) => api.get('/mentor/proposals/', { params })
export const updateProposalStatus  = (id, data)    => api.patch(`/proposals/${id}/`, data)
export const deleteProposal          = (id)          => api.delete(`/proposals/${id}/`)
export const getStudentInfo         = (email)       => api.get('/auth/student-info/', { params: { email } })

/**
 * submitProposal — multipart/form-data with all applicant fields + team + file + draft option.
 * If data.id is provided, it updates the existing proposal.
 */
export function submitProposal(data) {
  const form = new FormData()
  if (data.project)              form.append('project', data.project)
  if (data.message !== undefined) form.append('message', data.message)
  
  // Applicant detail fields
  if (data.applicant_name)       form.append('applicant_name',       data.applicant_name)
  if (data.applicant_roll_no)    form.append('applicant_roll_no',    data.applicant_roll_no)
  if (data.applicant_contact)    form.append('applicant_contact',    data.applicant_contact)
  if (data.applicant_email)      form.append('applicant_email',      data.applicant_email)
  if (data.applicant_department) form.append('applicant_department', data.applicant_department)
  if (data.applicant_year)       form.append('applicant_year',       data.applicant_year)
  
  // Team application fields
  if (data.application_type)     form.append('application_type',     data.application_type)
  if (data.team_name)            form.append('team_name',            data.team_name)
  if (data.members) {
    form.append('members', typeof data.members === 'string' ? data.members : JSON.stringify(data.members))
  }
  
  // Draft option
  if (data.is_draft !== undefined) {
    form.append('is_draft', data.is_draft)
  }

  // File
  if (data.attachment)           form.append('attachment',           data.attachment)

  if (data.id) {
    return api.patch(`/proposals/${data.id}/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  return api.post('/proposals/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function submitOwnStatement(data) {
  const form = new FormData()
  form.append('roll_no', data.roll_no)
  form.append('name', data.name)
  form.append('dept', data.dept)
  form.append('phone_number', data.phone_number)
  form.append('email', data.email)
  form.append('statement', data.statement)
  form.append('description', data.description)
  if (data.detailed_document) {
    form.append('detailed_document', data.detailed_document)
  }
  return api.post('/proposals/own-statements/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}