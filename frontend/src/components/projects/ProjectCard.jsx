import { Link } from 'react-router-dom'
import { Calendar, User, Building2, BookOpen, Clock } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

// Project type tag — Academic (purple) or Industry (teal)
function TypeTag({ type }) {
  if (type === 'industry') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                       bg-teal-50 text-teal-700 border border-teal-200">
        <Building2 size={10} /> Industry
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                     bg-brand-50 text-brand-700 border border-brand-200">
      <BookOpen size={10} /> Academic
    </span>
  )
}

export default function ProjectCard({ project, actions }) {
  const isOverdue = project.deadline && new Date(project.deadline) < new Date()

  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow flex flex-col gap-3">

      {/* ── Header row: title + status ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <Link
          to={`/projects/${project.id}`}
          className="font-semibold text-gray-900 hover:text-brand-600 transition-colors
                     leading-snug line-clamp-2"
        >
          {project.title}
        </Link>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Badge status={project.status} />
          <TypeTag type={project.project_type} />
        </div>
      </div>

      {/* ── Industry name pill (only for industry projects) ─────────────── */}
      {project.project_type === 'industry' && project.industry_name && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700
                        bg-teal-50 border border-teal-100 rounded-lg px-2.5 py-1.5 w-fit">
          <Building2 size={12} />
          {project.industry_name}
        </div>
      )}

      {/* ── Description ───────────────────────────────────────────────── */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
        {project.description}
      </p>

      {/* ── Footer meta row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-1 flex-wrap">
        <span className="flex items-center gap-1.5">
          <User size={12} />
          {project.mentor_email}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {format(new Date(project.created_at), 'MMM d, yyyy')}
        </span>
        {project.deadline && (
          <span className={`flex items-center gap-1.5 font-medium ${
            isOverdue ? 'text-red-500' : 'text-amber-600'
          }`}>
            <Clock size={12} />
            {isOverdue ? 'Expired · ' : 'Deadline: '}
            {format(new Date(project.deadline), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {actions && (
        <div className="border-t border-gray-100 pt-3 flex gap-2">{actions}</div>
      )}
    </div>
  )
}