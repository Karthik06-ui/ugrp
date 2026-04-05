import { Link, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, User, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// Nav items shown to all visitors (logged-in or not)
const PUBLIC_NAV = [
  { label: 'About',    to: '/about' },
  // { label: 'People',   to: '/people' },
  { label: 'Process',  to: '/process' },
  { label: 'Explore',  to: '/explore' },
  { label: 'Blogs',    to: '/blogs' },
  { label: 'Contact',  to: '/contact' },
]

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, isLoggedIn, isStudent, isMentor, logout } = useAuth()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const dashboardPath = isStudent ? '/student/dashboard' : '/mentor/dashboard'

  // Show first N links inline, rest in "More" dropdown
  const INLINE_COUNT = 4
  const inlineLinks = PUBLIC_NAV.slice(0, INLINE_COUNT)
  const moreLinks   = PUBLIC_NAV.slice(INLINE_COUNT)

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors px-1 py-0.5 rounded ${
      isActive
        ? 'text-brand-600'
        : 'text-gray-500 hover:text-gray-900'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-3">

      {/* Hamburger — only visible when sidebar exists (logged-in, mobile) */}
      {isLoggedIn && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      )}

      {/* Brand */}
      <Link to={isLoggedIn ? dashboardPath : '/'} className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 tracking-tight text-sm hidden sm:block">UGRP</span>
      </Link>

      {/* ── Public nav links (desktop) ───────────────────────────── */}
      <nav className="hidden md:flex items-center gap-1 ml-3">
        {inlineLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={navLinkClass}>
            {link.label}
          </NavLink>
        ))}

        {/* "More" dropdown for the remaining links */}
        {moreLinks.length > 0 && (
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(o => !o)}
              className="flex items-center gap-0.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-1 py-0.5 rounded"
            >
              More <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                {moreLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'text-brand-600 bg-brand-50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="flex-1" />

      {/* ── Right side: user controls ───────────────────────────── */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          {/* Role pill */}
          <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isStudent
              ? 'bg-teal-50 text-teal-700 border-teal-200'
              : 'bg-coral-50 text-coral-700 border-coral-200'
          }`}>
            {user?.role}
          </span>
          {/* Email */}
          <span className="hidden md:block text-sm text-gray-500">{user?.email}</span>
          {/* Profile */}
          <Link
            to="/profile"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <User size={17} />
          </Link>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={17} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login"    className="btn-secondary text-xs px-3 py-1.5">Log in</Link>
          <Link to="/register" className="btn-primary  text-xs px-3 py-1.5">Sign up</Link>
        </div>
      )}
    </header>
  )
}