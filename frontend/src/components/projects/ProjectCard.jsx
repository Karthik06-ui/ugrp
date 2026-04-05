import { Link } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import Badge from '../ui/Badge'
import { format } from 'date-fns'

export default function ProjectCard({ project, actions }) {
  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/projects/${project.id}`} className="font-semibold text-gray-900 hover:text-brand-600 transition-colors leading-snug line-clamp-2">
          {project.title}
        </Link>
        <Badge status={project.status} />
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{project.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto pt-1">
        <span className="flex items-center gap-1.5">
          <User size={12} />
          {project.mentor_email}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {format(new Date(project.created_at), 'MMM d, yyyy')}
        </span>
      </div>

      {actions && <div className="border-t border-gray-100 pt-3 flex gap-2">{actions}</div>}
    </div>
  )
}