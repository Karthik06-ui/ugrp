import { Calendar, User } from 'lucide-react'
import Badge from '../ui/Badge'

export default function TaskCard({ task, actions }) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  return (
    <div className={`card p-4 flex flex-col gap-2.5 ${isOverdue ? 'border-red-200' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-gray-900 text-sm leading-snug">{task.title}</p>
        <Badge status={task.status} />
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
        {task.assigned_to_name && (
          <span className="flex items-center gap-1"><User size={11} />{task.assigned_to_name}</span>
        )}
        {task.due_date && (
          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <Calendar size={11} />
            {isOverdue ? 'Overdue · ' : ''}{new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
        <span className="text-gray-300">·</span>
        <span className="text-gray-400">{task.project_title}</span>
      </div>
      {actions && <div className="border-t border-gray-100 pt-2.5 flex gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}