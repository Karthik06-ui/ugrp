import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, PenLine, Image as ImageIcon, X, ExternalLink, Calendar, User, Tag } from 'lucide-react'
import { listBlogs, createBlog } from '../../api/blogs'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

// ── Blog card — matches the design in the screenshot ─────────────────────────
function BlogCard({ blog }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all group flex flex-col">
      {/* Cover image */}
      <Link to={`/blog/${blog.id}`} className="relative block overflow-hidden h-52 bg-gray-100 flex-shrink-0">
        {blog.image_url ? (
          <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
            <PenLine size={32} className="text-brand-300" />
          </div>
        )}
        {/* Category pill overlaid on image */}
        {blog.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {blog.category}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        {/* Date */}
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          {format(new Date(blog.created_at), 'MMM, yyyy')}
        </p>

        {/* Title */}
        <Link to={`/blog/${blog.id}`}>
          <h3 className="font-bold text-gray-900 leading-snug hover:text-brand-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
          {blog.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
          <span className="text-xs text-gray-400 font-medium">{blog.author_name}</span>
          {blog.external_link ? (
            <a
              href={blog.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-1 transition-colors"
            >
              Read more <ExternalLink size={11} />
            </a>
          ) : (
            <Link to={`/blog/${blog.id}`} className="text-xs text-brand-600 font-semibold hover:text-brand-800 flex items-center gap-1">
              Read more →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Write blog form ───────────────────────────────────────────────────────────
function WriteBlogForm({ onClose }) {
  const qc = useQueryClient()
  const imgRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    title: '', content: '', category: '', external_link: '',
    author_name: '', author_email: '', author_contact: '', image: null,
  })
  const [errors, setErrors] = useState({})

  function handle(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return }
    setForm(f => ({ ...f, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())          e.title          = 'Title is required'
    if (!form.content.trim())        e.content        = 'Content is required'
    if (!form.author_name.trim())    e.author_name    = 'Your name is required'
    if (!form.author_email.trim())   e.author_email   = 'Email is required'
    if (!form.author_contact.trim()) e.author_contact = 'Contact is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const mut = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success('Blog published!')
      qc.invalidateQueries(['blogs'])
      onClose()
    },
    onError: e => {
      const data = e.response?.data
      if (data && typeof data === 'object') {
        setErrors(data)
        toast.error('Please fix the errors below')
      } else {
        toast.error('Could not publish blog')
      }
    },
  })

  function submit(e) {
    e.preventDefault()
    if (validate()) mut.mutate(form)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Image upload */}
      <div>
        <label className="label">Cover image <span className="normal-case font-normal text-gray-400">(optional)</span></label>
        {preview ? (
          <div className="relative rounded-xl overflow-hidden h-40 group">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null); setForm(f => ({ ...f, image: null })) }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => imgRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center
                       justify-center gap-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-all"
          >
            <ImageIcon size={22} className="text-gray-300" />
            <p className="text-xs text-gray-400">Click to upload cover image (JPG/PNG, max 5 MB)</p>
          </div>
        )}
        <input ref={imgRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImage} className="hidden" />
      </div>

      {/* Title */}
      <div>
        <label className="label">Blog title *</label>
        <input name="title" value={form.title} onChange={handle} className="input" placeholder="e.g. When Problems Refuse to Stay Simple" />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="label">Category / tag <span className="normal-case font-normal text-gray-400">(optional)</span></label>
        <input name="category" value={form.category} onChange={handle} className="input" placeholder="e.g. Research, AI, Fellowship, Systems Thinking" />
      </div>

      {/* Content */}
      <div>
        <label className="label">Blog content *</label>
        <textarea name="content" value={form.content} onChange={handle}
          className="input min-h-[160px] resize-y"
          placeholder="Write your blog post here. You can share insights, experiences, research findings, or anything relevant to the UGRP community..."
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
      </div>

      {/* External link */}
      <div>
        <label className="label">External link <span className="normal-case font-normal text-gray-400">(optional — LinkedIn, paper, etc.)</span></label>
        <input name="external_link" value={form.external_link} onChange={handle} type="url"
          className="input" placeholder="https://linkedin.com/posts/..." />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
          <User size={11} /> Your contact details are stored privately — only your <strong className="text-gray-600">name</strong> is shown on the blog.
        </p>
      </div>

      {/* Author name */}
      <div>
        <label className="label">Your name * <span className="normal-case font-normal text-gray-400">(shown publicly)</span></label>
        <input name="author_name" value={form.author_name} onChange={handle} className="input" placeholder="e.g. Arjun S." />
        {errors.author_name && <p className="text-xs text-red-500 mt-1">{errors.author_name}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Email */}
        <div>
          <label className="label">Email * <span className="normal-case font-normal text-gray-400">(private)</span></label>
          <input name="author_email" value={form.author_email} onChange={handle} type="email" className="input" placeholder="you@example.com" />
          {errors.author_email && <p className="text-xs text-red-500 mt-1">{errors.author_email}</p>}
        </div>
        {/* Contact */}
        <div>
          <label className="label">Contact * <span className="normal-case font-normal text-gray-400">(private)</span></label>
          <input name="author_contact" value={form.author_contact} onChange={handle} className="input" placeholder="+91 99999 99999" />
          {errors.author_contact && <p className="text-xs text-red-500 mt-1">{errors.author_contact}</p>}
        </div>
      </div>

      <button type="submit" disabled={mut.isPending} className="btn-primary w-full justify-center py-2.5 mt-2">
        {mut.isPending ? 'Publishing…' : 'Publish blog post'}
      </button>
    </form>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function BlogsPage() {
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [writeOpen, setWriteOpen] = useState(false)

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs', search, category],
    queryFn:  () => listBlogs({ search, category }).then(r => r.data),
  })

  // Unique categories from fetched blogs
  const allCategories = [...new Set((blogs).map(b => b.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div>
            <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">Community blog</p>
            <h1 className="text-4xl font-bold mb-3">Stories from the research community</h1>
            <p className="text-brand-100 max-w-lg text-lg leading-relaxed">
              Insights, experiences, and ideas shared by students, mentors, and researchers.
              Anyone can read — anyone can write.
            </p>
          </div>
          <button
            onClick={() => setWriteOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-black text-brand-700 font-semibold
                       px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-sm"
          >
            <PenLine size={16} /> Write a blog
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-8 text-sm" placeholder="Search blogs…"
            />
          </div>
          {allCategories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={13} className="text-gray-400" />
              <button
                onClick={() => setCategory('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  !category ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >All</button>
              {allCategories.map(c => (
                <button
                  key={c} onClick={() => setCategory(c === category ? '' : c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    category === c ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >{c}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blog grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        {isLoading ? (
          <PageSpinner />
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={PenLine}
            title="No blog posts yet"
            description="Be the first to share your research story with the UGRP community."
            action={
              <button onClick={() => setWriteOpen(true)} className="btn-primary">
                Write the first blog
              </button>
            }
          />
        ) : (
          <>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-6">
              {blogs.length} post{blogs.length !== 1 ? 's' : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(b => <BlogCard key={b.id} blog={b} />)}
            </div>
          </>
        )}
      </section>

      {/* Write modal */}
      <Modal open={writeOpen} onClose={() => setWriteOpen(false)} title="Write a blog post" size="lg">
        <WriteBlogForm onClose={() => setWriteOpen(false)} />
      </Modal>
    </div>
  )
}