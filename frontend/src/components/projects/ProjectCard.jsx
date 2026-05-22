import { Link } from 'react-router-dom'
import { Calendar, User, Building2, BookOpen, Clock } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

// Project type tag — Academic (purple) or Industry (teal)
function TypeTag({ type }) {
  if (type === 'industry') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
        <Building2 size={10} /> Industry
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
      <BookOpen size={10} /> Academic
    </span>
  )
}

export default function ProjectCard({ project, actions }) {
  const isOverdue = project.deadline && new Date(project.deadline) < new Date()

  return (
    <div className="card card-hover-effect group p-6 flex flex-col gap-4 border border-slate-100 bg-white/80 backdrop-blur-sm text-left relative">
      {/* Absolute overlay link to make the entire card clickable */}
      <Link
        to={`/projects/${project.id}`}
        className="absolute inset-0 z-10 rounded-2xl"
        aria-label={`View details for ${project.title}`}
      />

      {/* ── Header row: title + status ────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 relative z-0">
        <span className="font-bold text-slate-900 group-hover:text-indigo-650 transition-colors leading-snug text-base line-clamp-2">
          {project.title}
        </span>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <Badge status={project.status} />
          <TypeTag type={project.project_type} />
        </div>
      </div>

      {/* ── Industry name pill (only for industry projects) ─────────────── */}
      {project.project_type === 'industry' && project.industry_name && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-800
                        bg-teal-50/70 border border-teal-100/60 rounded-xl px-3 py-1 w-fit relative z-0">
          <Building2 size={12} />
          {project.industry_name}
        </div>
      )}

      {/* ── Description ───────────────────────────────────────────────── */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 relative z-0">
        {project.description}
      </p>

      {/* ── Footer meta row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50/80 flex-wrap relative z-0">
        <span className="flex items-center gap-1.5">
          <User size={13} className="text-slate-400" />
          <span className="truncate max-w-[140px]" title={project.mentor_email}>{project.mentor_email}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          {format(new Date(project.created_at), 'MMM d, yyyy')}
        </span>
        {project.deadline && (
          <span className={`flex items-center gap-1.5 font-medium ${
            isOverdue ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded-md' : 'text-amber-600 bg-amber-50/70 px-2 py-0.5 rounded-md'
          }`}>
            <Clock size={12} />
            {isOverdue ? 'Expired' : format(new Date(project.deadline), 'MMM d, yyyy')}
          </span>
        )}
      </div>

      {actions && (
        <div
          className="border-t border-slate-100/80 pt-3.5 flex gap-2.5 relative z-20"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          {actions}
        </div>
      )}
    </div>
  )
}