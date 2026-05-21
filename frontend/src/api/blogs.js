import api from './axios'

export const listBlogs  = (params = {}) => api.get('/blogs/', { params })
export const getBlog    = (id)           => api.get(`/blogs/${id}/`)

export function createBlog(data) {
  const form = new FormData()
  form.append('title',          data.title)
  form.append('content',        data.content)
  form.append('author_name',    data.author_name)
  form.append('author_email',   data.author_email)
  form.append('author_contact', data.author_contact)
  if (data.category)      form.append('category',      data.category)
  if (data.external_link) form.append('external_link', data.external_link)
  if (data.image)         form.append('image',         data.image)
  return api.post('/blogs/create/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}