import { Link, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const publicLinks = [
  { to: '/about',   label: 'About'      },
  { to: '/people',  label: 'People'     },
  { to: '/process', label: 'Process'    },
  { to: '/explore', label: 'Explore us' },
  { to: '/blog',    label: 'Blog'       },
  { to: '/contact', label: 'Contact'    },
]

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, isLoggedIn, isStudent, isMentor, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileNav, setMobileNav] = useState(false)

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const dashboardPath = isStudent ? '/student/dashboard' : '/mentor/dashboard'

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="h-14 flex items-center px-4 gap-3">

        {/* Hamburger — only for authenticated sidebar */}
        {isLoggedIn && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
                       hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        )}

        {/* Brand */}
        <Link
          to={isLoggedIn ? dashboardPath : '/'}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-sm hidden sm:block">UGRP</span>
        </Link>

        {/* Public nav links — only shown when NOT logged in */}
        {!isLoggedIn && (
          <nav className="hidden lg:flex items-center gap-0.5 ml-4">
            {publicLinks.map(({ to, label }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm transition-colors font-medium ${
                    isActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex-1" />

        {/* Right side */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            {/* Role pill */}
            <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full
              text-xs font-medium border ${
              isStudent
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-coral-50 text-coral-700 border-coral-200'
            }`}>
              {user?.role}
            </span>
            <span className="hidden md:block text-sm text-gray-500">{user?.email}</span>
            <Link
              to="/profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg
                         hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <User size={17} />
            </Link>
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg
                         hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={17} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNav(o => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
                         hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link to="/login"    className="btn-secondary text-xs px-3 py-1.5">Log in</Link>
            <Link to="/register" className="btn-primary  text-xs px-3 py-1.5">Sign up</Link>
          </div>
        )}
      </div>

      {/* Mobile nav dropdown — public links when not logged in */}
      {!isLoggedIn && mobileNav && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {publicLinks.map(({ to, label }) => (
            <NavLink
              key={to} to={to}
              onClick={() => setMobileNav(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}