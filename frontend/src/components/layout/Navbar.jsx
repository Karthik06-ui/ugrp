import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LogOut,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

/* ──────────────────────────────────────────────────────────────
   PUBLIC NAVIGATION STRUCTURE
────────────────────────────────────────────────────────────── */

const publicLinks = [
  {
    label: 'About',
    children: [
      { to: '/about', label: 'About KREST' },
      { to: '/people', label: 'People' },
      { to: '/process', label: 'The KREST Journey' },
    ],
  },

  {
    label: 'Programs',
    children: [
      { to: '/explore', label: 'Programs Overview' },
      { to: '/programs/reflect', label: 'REFLECT' },
      { to: '/programs/core', label: 'CORE' },
      { to: '/programs/krip', label: 'KRIP' },
    ],
  },

  {
    label: 'Community',
    children: [
      { to: '/students-faculty', label: 'Students & Faculty' },
    ],
  },

  {
    label: 'Insights',
    children: [
      { to: '/blog', label: 'Blog' },
    ],
  },

  {
    label: 'Contact',
    children: [
      { to: '/contact', label: 'Contact Us' },
    ],
  },
]

export default function Navbar({ onMenuToggle, menuOpen }) {
  const { user, isLoggedIn, isStudent, logout } = useAuth()

  const navigate = useNavigate()

  const [mobileNav, setMobileNav] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
  if (mobileNav) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }

  return () => {
    document.body.style.overflow = 'auto'
  }
}, [mobileNav])

  useEffect(() => {
    if (isLoggedIn) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoggedIn])

  function handleLogout() {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const dashboardPath = isStudent
    ? '/student/dashboard'
    : '/mentor/dashboard'

  /* ──────────────────────────────────────────────────────────────
     AUTH NAVBAR
  ────────────────────────────────────────────────────────────── */

  if (isLoggedIn) {
    return (
      <header className="sticky top-0 z-40 bg-[#E8EFF4] border-b border-[#D0D8E0]">
        <div className="h-14 flex items-center px-4 gap-3">

          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
            hover:bg-[#D0D8E0] text-[#2E5C90] transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link
            to={dashboardPath}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span
              className="font-black tracking-widest text-sm text-[#022B59]"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '20px',
                letterSpacing: '3px',
              }}
            >
              KREST
            </span>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2">

            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full
              text-xs font-medium border ${
                isStudent
                  ? 'bg-[#E0F9F6] text-[#22C2A4] border-[#B3E6DD]'
                  : 'bg-[#E8F2FF] text-[#02A9DB] border-[#C5E1F5]'
              }`}
            >
              {user?.role}
            </span>

            <span className="hidden md:block text-sm text-[#2E5C90]">
              {user?.email}
            </span>

            <Link
              to="/profile"
              className="w-9 h-9 flex items-center justify-center rounded-lg
              hover:bg-[#D0D8E0] text-[#2E5C90] transition-colors"
            >
              <User size={17} />
            </Link>

            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg
              hover:bg-[#FFE8E8] text-[#02A9DB] transition-colors"
            >
              <LogOut size={17} />
            </button>

          </div>
        </div>
      </header>
    )
  }

  /* ──────────────────────────────────────────────────────────────
     PUBLIC NAVBAR
  ────────────────────────────────────────────────────────────── */
return (
  <>
    <style>
      {`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}
    </style>

    {/* HEADER */}
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? '#E8EFF4' : 'transparent',
        borderBottom: scrolled
          ? '1px solid #D0D8E0'
          : '1px solid transparent',
      }}
    >
      <div className="h-20 flex items-center justify-between px-8 md:px-14">

        {/* BRAND */}
        <Link
          to="/"
          className="flex flex-col leading-none gap-0.5 flex-shrink-0 no-underline"
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              letterSpacing: '6px',
              color: scrolled ? '#111111' : '#ffffff',
              transition: 'color 0.3s',
              lineHeight: 1,
            }}
          >
            KREST
          </span>

          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '9px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: scrolled
                ? '#2E5C90'
                : 'rgba(232,239,244,0.55)',
              transition: 'color 0.3s',
            }}
          >
            Research Ecosystem
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden xl:flex items-center gap-10">

          {publicLinks.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >

              <div
                className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${
                  scrolled
                    ? 'text-[#2E5C90] hover:text-[#022B59]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
                <ChevronDown size={15} />
              </div>

              {activeDropdown === item.label && (
                <div className="absolute top-full left-0 pt-4 w-[260px]">

                  <div className="border border-[#D0D8E0] bg-white shadow-xl">

                    {item.children.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          `block px-5 py-4 text-sm transition-colors border-b border-[#EEF2F6] last:border-none ${
                            isActive
                              ? 'bg-[#E8EFF4] text-[#022B59] font-semibold'
                              : 'text-slate-700 hover:bg-[#F6F8FB] hover:text-slate-900'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}

                  </div>

                </div>
              )}

            </div>
          ))}

        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">

          <Link
            to="/projects"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
            style={{
              backgroundColor: scrolled
                ? '#000'
                : 'rgba(232,239,244,0.15)',
              color: '#E8EFF4',
              border: scrolled
                ? '1.5px solid #000'
                : '1.5px solid rgba(232,239,244,0.5)',
              backdropFilter: scrolled ? 'none' : 'blur(8px)',
            }}
          >
            Explore Projects
          </Link>

          <Link
            to={isLoggedIn ? '/profile' : '/login'}
            aria-label="Account"
            style={iconBtnStyle(scrolled)}
          >
            <User size={20} />
          </Link>

          {/* <button
            aria-label="Search"
            style={iconBtnStyle(scrolled)}
          >
            <Search size={20} />
          </button> */}

          {/* MOBILE MENU BUTTON */}
          <button
            aria-label="Menu"
            onClick={() => setMobileNav(o => !o)}
            style={iconBtnStyle(scrolled)}
          >
            {mobileNav ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>
    </header>

    {/* RIGHT SIDEBAR */}
    <div
      className={`fixed top-0 right-0 h-screen w-[340px]
      bg-white z-[9999] shadow-2xl
      flex flex-col
      transition-transform duration-300 ease-in-out
      ${mobileNav ? 'translate-x-0' : 'translate-x-full'}`}
    >

      {/* SIDEBAR HEADER */}
      <div className="h-20 border-b border-[#E5EAF0] flex items-center justify-between px-6 shrink-0">

        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '30px',
              letterSpacing: '4px',
              color: '#022B59',
              lineHeight: 1,
            }}
          >
            KREST
          </h1>

          <p className="text-[10px] uppercase tracking-[0.3em] text-[#2E5C90] mt-1">
            Research Ecosystem
          </p>
        </div>

        <button
          onClick={() => setMobileNav(false)}
          className="w-10 h-10 rounded-lg flex items-center justify-center
          hover:bg-[#F3F6FA] text-[#2E5C90]"
        >
          <X size={22} />
        </button>

      </div>

      {/* SIDEBAR MENU */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {publicLinks.map((item) => (
          <div key={item.label} className="mb-8">

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#022B59]">
              {item.label}
            </p>

            <div className="space-y-1">

              {item.children.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileNav(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium
                  text-[#2E5C90] hover:bg-[#F6F8FB]
                  hover:text-[#022B59] transition-all"
                >
                  {link.label}
                </Link>
              ))}

            </div>

          </div>
        ))}

        {/* BUTTONS */}
        <div className="pt-6 border-t border-[#E5EAF0] flex flex-col gap-3">

          <Link
            to="/login"
            onClick={() => setMobileNav(false)}
            className="w-full py-3 rounded-xl border border-[#D0D8E0]
            text-center text-sm font-medium text-[#2E5C90]"
          >
            Log in
          </Link>

          <Link
            to="/register"
            onClick={() => setMobileNav(false)}
            className="w-full py-3 rounded-xl bg-[#022B59]
            text-center text-sm font-semibold text-white"
          >
            Sign up
          </Link>

        </div>

      </div>

    </div>

    {/* BACKDROP */}
    {mobileNav && (
      <div
        className="fixed inset-0 bg-black/40 z-[9998]"
        onClick={() => setMobileNav(false)}
      />
    )}

  </>
)
}


/* ──────────────────────────────────────────────────────────────
   ICON BUTTON STYLE
────────────────────────────────────────────────────────────── */

function iconBtnStyle(scrolled) {
  return {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: scrolled
      ? '#2E5C90'
      : 'rgba(232,239,244,0.85)',
  }
}