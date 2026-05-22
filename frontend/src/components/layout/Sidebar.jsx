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
  const activeStyle = isStudent
    ? 'text-[#22C2A4] bg-[#E0F9F6] border-l-2 border-[#22C2A4] font-semibold'
    : 'text-[#02A9DB] bg-[#E8F2FF] border-l-2 border-[#02A9DB] font-semibold'

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity" onClick={onClose} />
      )}

      <aside className={`
        fixed top-14 left-0 bottom-0 z-30 w-56 bg-white border-r border-slate-200/80
        flex flex-col overflow-y-auto transition-all duration-300 ease-in-out shadow-sm
        lg:translate-x-0 lg:static lg:top-auto lg:bottom-auto lg:h-full
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="flex-1 px-3 py-4 space-y-1.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              end={to.endsWith('dashboard') || to.endsWith('/projects') || to === '/projects'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                  isActive
                    ? `${activeStyle} shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]`
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={16} className="transition-transform duration-300" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            {isStudent ? 'Student Portal' : 'Mentor Portal'}
          </p>
        </div>
      </aside>
    </>
  )
}

