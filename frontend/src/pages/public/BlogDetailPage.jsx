import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, User, ExternalLink, Tag } from 'lucide-react'
import { getBlog } from '../../api/blogs'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

export default function BlogDetailPage() {
  const { id } = useParams()

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn:  () => getBlog(id).then(r => r.data),
  })

  if (isLoading) return <PageSpinner />
  if (!blog)     return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Blog post not found.
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Cover image */}
      {blog.image_url && (
        <div className="w-full h-72 sm:h-96 overflow-hidden bg-gray-100">
          <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        {/* Category */}
        {blog.category && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                           bg-brand-50 text-brand-700 border border-brand-200 mb-4">
            <Tag size={10} /> {blog.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-5">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100 mb-8">
          <span className="flex items-center gap-1.5">
            <User size={13} /> {blog.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {format(new Date(blog.created_at), 'MMMM d, yyyy')}
          </span>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base whitespace-pre-wrap mb-10">
          {blog.content}
        </div>

        {/* External link */}
        {blog.external_link && (
          <div className="border-t border-gray-100 pt-6 mb-8">
            <p className="text-sm text-gray-500 mb-2 font-medium">Read the original article:</p>
            <a
              href={blog.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-semibold
                         bg-brand-50 border border-brand-200 px-4 py-2.5 rounded-xl transition-colors text-sm"
            >
              <ExternalLink size={14} /> {blog.external_link}
            </a>
          </div>
        )}

        {/* Author card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
            {blog.author_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{blog.author_name}</p>
            <p className="text-xs text-gray-400 mt-0.5">UGRP community contributor</p>
          </div>
        </div>

        {/* Back to blog list */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link to="/blog" className="btn-secondary gap-2">
            <ArrowLeft size={14} /> All blog posts
          </Link>
        </div>
      </div>
    </div>
  )
}