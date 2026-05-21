import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  PenLine,
  Image as ImageIcon,
  X,
  ExternalLink,
  User,
  Tag,
  ArrowRight,
} from 'lucide-react'
import { listBlogs, createBlog } from '../../api/blogs'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { PageSpinner } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

/* ────────────────────────────────────────────────────────────────
   BLOG CARD
──────────────────────────────────────────────────────────────── */
function BlogCard({ blog }) {
  return (
    <article className="group flex flex-col overflow-hidden border border-black/5 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.08)]">

      {/* IMAGE */}
      <Link
        to={`/blog/${blog.id}`}
        className="relative block h-[260px] overflow-hidden bg-slate-100"
      >
        {blog.image_url ? (
          <img
            src={blog.image_url}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <PenLine size={34} className="text-slate-400" />
          </div>
        )}

        {blog.category && (
          <div className="absolute left-5 top-5 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 backdrop-blur">
            {blog.category}
          </div>
        )}
      </Link>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-8">

        <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">
          <span>
            {format(new Date(blog.created_at), 'MMM dd, yyyy')}
          </span>

          <span>•</span>

          <span>{blog.author_name}</span>
        </div>

        <Link to={`/blog/${blog.id}`}>
          <h3 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-900 transition-colors duration-300 group-hover:text-sky-700">
            {blog.title}
          </h3>
        </Link>

        <p className="mt-5 flex-1 text-[15px] leading-8 text-slate-600 line-clamp-4">
          {blog.content}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User size={15} />
            {blog.author_name}
          </div>

          {blog.external_link ? (
            <a
              href={blog.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-300 hover:gap-3"
            >
              Read Article
              <ExternalLink size={15} />
            </a>
          ) : (
            <Link
              to={`/blog/${blog.id}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-all duration-300 hover:gap-3"
            >
              Read More
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

/* ────────────────────────────────────────────────────────────────
   WRITE BLOG FORM
──────────────────────────────────────────────────────────────── */
function WriteBlogForm({ onClose }) {
  const qc = useQueryClient()
  const imgRef = useRef(null)

  const [preview, setPreview] = useState(null)

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    external_link: '',
    author_name: '',
    author_email: '',
    author_contact: '',
    image: null,
  })

  const [errors, setErrors] = useState({})

  function handle(e) {
    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be below 5MB')
      return
    }

    setForm(f => ({
      ...f,
      image: file,
    }))

    setPreview(URL.createObjectURL(file))
  }

  function validate() {
    const e = {}

    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.content.trim()) e.content = 'Content is required'
    if (!form.author_name.trim()) e.author_name = 'Name is required'
    if (!form.author_email.trim()) e.author_email = 'Email is required'
    if (!form.author_contact.trim()) e.author_contact = 'Contact is required'

    setErrors(e)

    return Object.keys(e).length === 0
  }

  const mutation = useMutation({
    mutationFn: createBlog,

    onSuccess: () => {
      toast.success('Blog published')
      qc.invalidateQueries(['blogs'])
      onClose()
    },

    onError: () => {
      toast.error('Failed to publish blog')
    },
  })

  function submit(e) {
    e.preventDefault()

    if (validate()) {
      mutation.mutate(form)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">

      {/* IMAGE */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Cover Image
        </label>

        {preview ? (
          <div className="relative h-56 overflow-hidden border border-black/5">
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={() => {
                setPreview(null)
                setForm(f => ({ ...f, image: null }))
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-black/70 text-white"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => imgRef.current?.click()}
            className="flex h-56 cursor-pointer flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50 transition-colors duration-300 hover:bg-slate-100"
          >
            <ImageIcon size={30} className="text-slate-400" />

            <p className="mt-4 text-sm text-slate-500">
              Click to upload cover image
            </p>
          </div>
        )}

        <input
          ref={imgRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleImage}
          className="hidden"
        />
      </div>

      {/* TITLE */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Blog Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handle}
          placeholder="Enter blog title"
          className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
        />

        {errors.title && (
          <p className="mt-2 text-xs text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Category
        </label>

        <input
          name="category"
          value={form.category}
          onChange={handle}
          placeholder="Research, AI, Systems..."
          className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
        />
      </div>

      {/* CONTENT */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Blog Content
        </label>

        <textarea
          name="content"
          value={form.content}
          onChange={handle}
          placeholder="Write your thoughts..."
          className="min-h-[220px] w-full resize-y border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
        />

        {errors.content && (
          <p className="mt-2 text-xs text-red-500">
            {errors.content}
          </p>
        )}
      </div>

      {/* LINK */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          External Link
        </label>

        <input
          type="url"
          name="external_link"
          value={form.external_link}
          onChange={handle}
          placeholder="https://..."
          className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
        />
      </div>

      {/* AUTHOR */}
      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Your Name
          </label>

          <input
            name="author_name"
            value={form.author_name}
            onChange={handle}
            className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700">
            Contact
          </label>

          <input
            name="author_contact"
            value={form.author_contact}
            onChange={handle}
            className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          Email
        </label>

        <input
          type="email"
          name="author_email"
          value={form.author_email}
          onChange={handle}
          className="w-full border border-slate-200 px-5 py-4 outline-none transition-all duration-300 focus:border-slate-900"
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-slate-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-slate-800"
      >
        {mutation.isPending ? 'Publishing...' : 'Publish Blog'}
      </button>
    </form>
  )
}

/* ────────────────────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────────────────────── */
export default function BlogsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [writeOpen, setWriteOpen] = useState(false)

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs', search, category],

    queryFn: () =>
      listBlogs({ search, category }).then(r => r.data),
  })

  const categories = [
    ...new Set(blogs.map(b => b.category).filter(Boolean)),
  ]

  return (
    <div className="bg-[#F6F8FB] text-[#0F172A]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/5 bg-[#0F172A] text-white">

        <div className="absolute inset-0">
          <div className="absolute right-[-120px] top-[-120px] h-[520px] w-[520px] rounded-full bg-sky-500/10 blur-[120px]" />
          <div className="absolute bottom-[-120px] left-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1600px] px-6 pb-28 pt-40 lg:px-16">

          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-sky-300">
            KREST Journal
          </p>

          <h1 className="max-w-5xl text-[clamp(4rem,8vw,8rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
            Stories,
            <br />
            Inquiry &
            <br />
            Reflection.
          </h1>

          <p className="mt-10 max-w-3xl text-lg leading-[2] text-slate-300">
            Research experiences, essays, insights, experiments,
            observations, failures, breakthroughs, and conversations from
            the KREST ecosystem.
          </p>

          <button
            onClick={() => setWriteOpen(true)}
            className="mt-12 inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-900 transition-all duration-300 hover:gap-5"
          >
            Write a Blog
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-black/5 bg-white py-8">

        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-6 lg:px-16">

          {/* SEARCH */}
          <div className="relative min-w-[280px] flex-1">

            <Search
              size={16}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full border border-black/5 bg-slate-50 py-4 pl-14 pr-5 text-sm outline-none transition-all duration-300 focus:border-slate-900"
            />
          </div>

          {/* CATEGORIES */}
          <div className="flex flex-wrap gap-3">

            <button
              onClick={() => setCategory('')}
              className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                category === ''
                  ? 'bg-slate-900 text-white'
                  : 'border border-black/5 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>

            {categories.map(cat => (
              <button
                key={cat}
                onClick={() =>
                  setCategory(category === cat ? '' : cat)
                }
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                  category === cat
                    ? 'bg-slate-900 text-white'
                    : 'border border-black/5 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="py-24">

        <div className="mx-auto max-w-[1600px] px-6 lg:px-16">

          {isLoading ? (
            <PageSpinner />
          ) : blogs.length === 0 ? (
            <EmptyState
              icon={PenLine}
              title="No blog posts yet"
              description="Be the first to contribute to the KREST Journal."
              action={
                <button
                  onClick={() => setWriteOpen(true)}
                  className="bg-slate-900 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-white"
                >
                  Write First Blog
                </button>
              }
            />
          ) : (
            <>
              <div className="mb-12 flex items-center justify-between">

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Published Articles
                  </p>

                  <h2 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-900">
                    {blogs.length} Articles
                  </h2>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {blogs.map(blog => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* MODAL */}
      <Modal
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        title="Write a Blog"
        size="lg"
      >
        <WriteBlogForm onClose={() => setWriteOpen(false)} />
      </Modal>
    </div>
  )
}