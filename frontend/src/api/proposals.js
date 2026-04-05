import api from './axios'

// Student: list all their own proposals, optional ?status= filter
export const getStudentProposals   = (params = {}) => api.get('/proposals/list/', { params })

// Mentor: list incoming proposals for their projects
export const getMentorProposals    = (params = {}) => api.get('/mentor/proposals/', { params })

// Mentor: accept or reject a proposal
export const updateProposalStatus  = (id, data)    => api.patch(`/proposals/${id}/`, data)

/**
 * submitProposal
 * Sends multipart/form-data so the optional file attachment is included.
 * @param {{ project: number, message: string, attachment?: File|null }} data
 */
export function submitProposal(data) {
  const form = new FormData()
  form.append('project', data.project)
  form.append('message', data.message)
  if (data.attachment) form.append('attachment', data.attachment)
  return api.post('/proposals/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}