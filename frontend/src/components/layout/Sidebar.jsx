import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, FileText, Users,
  CheckSquare, Star, MessageSquare, PlusCircle,
  BookOpen, ClipboardList, Award,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const studentLinks = [
  { to: '/student/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',           icon: BookOpen,         label: 'Browse projects' },
  { to: '/student/proposals',  icon: FileText,         label: 'My proposals' },
  { to: '/student/enrollments',icon: Users,            label: 'My enrollments' },
  { to: '/student/tasks',      icon: CheckSquare,      label: 'My tasks' },
  { to: '/student/reviews',    icon: Award,            label: 'Reviews' },
  { to: '/student/remarks',    icon: MessageSquare,    label: 'Remarks' },
]

const mentorLinks = [
  { to: '/mentor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',           icon: BookOpen,         label: 'All projects' },
  { to: '/mentor/projects',    icon: FolderOpen,       label: 'My projects' },
  { to: '/mentor/projects/new',icon: PlusCircle,       label: 'Create project' },
  { to: '/mentor/proposals',   icon: ClipboardList,    label: 'Proposals inbox' },
  { to: '/mentor/tasks',       icon: CheckSquare,      label: 'Manage tasks' },
  { to: '/mentor/reviews',     icon: Star,             label: 'Write reviews' },
  { to: '/mentor/remarks',     icon: MessageSquare,    label: 'Remarks' },
]

export default function Sidebar({ open, onClose }) {
  const { isStudent } = useAuth()
  const links = isStudent ? studentLinks : mentorLinks
  const accent = isStudent ? 'text-teal-700 bg-teal-50' : 'text-coral-700 bg-coral-50'

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-14 left-0 bottom-0 z-30 w-56 bg-white border-r border-gray-100
        flex flex-col overflow-y-auto transition-transform duration-200
        lg:translate-x-0 lg:static lg:top-auto lg:bottom-auto lg:h-full
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              end={to.endsWith('dashboard') || to.endsWith('/projects') || to === '/projects'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? `${accent} font-medium`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            {isStudent ? 'Student portal' : 'Mentor portal'}
          </p>
        </div>
      </aside>
    </>
  )
}