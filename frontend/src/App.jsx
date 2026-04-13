import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'

// Layout
import Navbar  from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'

// Auth guards
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleRoute      from './components/auth/RoleRoute'

// Public pages — no login required
import LandingPage   from './pages/public/LandingPage'
import LoginPage     from './pages/public/LoginPage'
import RegisterPage  from './pages/public/RegisterPage'
import AboutPage     from './pages/public/AboutPage'
import PeoplePage    from './pages/public/PeoplePage'
import ProcessPage   from './pages/public/ProcessPage'
import ExploreUsPage from './pages/public/ExploreUsPage'
import BlogsPage     from './pages/public/BlogsPage'
import BlogDetailPage from './pages/public/BlogDetailPage'
import ContactPage   from './pages/public/ContactPage'

// Shared pages
import ProjectsPage      from './pages/shared/ProjectPage'
import ProjectDetailPage from './pages/shared/ProjectDetailPage'
import ProfilePage       from './pages/shared/Profilepage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import MyProposals      from './pages/student/Myproposals'
import MyEnrollments    from './pages/student/MyEnrollments'
import MyTasks          from './pages/student/Mytasks'
import MyReviews        from './pages/student/MyReviews'
import ProjectRemarks   from './pages/student/ProjectRemarks'

// Mentor pages
import MentorDashboard from './pages/mentor/MentorDashboard'
import MyProjects      from './pages/mentor/MyProjects'
import CreateProject   from './pages/mentor/CreateProject'
import ProposalsInbox  from './pages/mentor/ProposalsInbox'
import ManageTasks     from './pages/mentor/ManageTasks'
import WriteReviews    from './pages/mentor/WriteReviews'
import PostRemarks     from './pages/mentor/PostRemarks'

// ── Shell layout: Navbar + optional Sidebar ───────────────────────────────────
function AppShell() {
  const { isLoggedIn } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onMenuToggle={() => setMenuOpen(o => !o)} menuOpen={menuOpen} />
      <div className="flex flex-1 overflow-hidden">
        {isLoggedIn && <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />}
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ── Public shell: Navbar only, no sidebar ────────────────────────────────────
function PublicShell() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  const { isLoggedIn, user } = useAuth()
  const dashPath = user?.role === 'student' ? '/student/dashboard' : '/mentor/dashboard'

  return (
    <Routes>

      {/* ── Standalone public pages (own full layout) ─────────────────────── */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={isLoggedIn ? <Navigate to={dashPath} replace /> : <LoginPage />} />
      <Route path="/register"element={isLoggedIn ? <Navigate to={dashPath} replace /> : <RegisterPage />} />

      {/* ── Public pages with Navbar only ────────────────────────────────── */}
      <Route element={<PublicShell />}>
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/people"  element={<PeoplePage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/explore" element={<ExploreUsPage />} />
        <Route path="/blog"    element={<BlogsPage />} />
        <Route path="/blog/:id"element={<BlogDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ── Authenticated shell: Navbar + Sidebar ────────────────────────── */}
      <Route element={<AppShell />}>

        {/* Public inside shell — no login needed */}
        <Route path="/projects"     element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />

        {/* Login required */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Student only */}
        <Route path="/student/dashboard"   element={<RoleRoute role="student"><StudentDashboard /></RoleRoute>} />
        <Route path="/student/proposals"   element={<RoleRoute role="student"><MyProposals /></RoleRoute>} />
        <Route path="/student/enrollments" element={<RoleRoute role="student"><MyEnrollments /></RoleRoute>} />
        <Route path="/student/tasks"       element={<RoleRoute role="student"><MyTasks /></RoleRoute>} />
        <Route path="/student/reviews"     element={<RoleRoute role="student"><MyReviews /></RoleRoute>} />
        <Route path="/student/remarks"     element={<RoleRoute role="student"><ProjectRemarks /></RoleRoute>} />

        {/* Mentor only */}
        <Route path="/mentor/dashboard"    element={<RoleRoute role="mentor"><MentorDashboard /></RoleRoute>} />
        <Route path="/mentor/projects"     element={<RoleRoute role="mentor"><MyProjects /></RoleRoute>} />
        <Route path="/mentor/projects/new" element={<RoleRoute role="mentor"><CreateProject /></RoleRoute>} />
        <Route path="/mentor/proposals"    element={<RoleRoute role="mentor"><ProposalsInbox /></RoleRoute>} />
        <Route path="/mentor/tasks"        element={<RoleRoute role="mentor"><ManageTasks /></RoleRoute>} />
        <Route path="/mentor/reviews"      element={<RoleRoute role="mentor"><WriteReviews /></RoleRoute>} />
        <Route path="/mentor/remarks"      element={<RoleRoute role="mentor"><PostRemarks /></RoleRoute>} />

        {/* Smart redirect */}
        <Route path="/dashboard" element={
          isLoggedIn
            ? <Navigate to={dashPath} replace />
            : <Navigate to="/login" replace />
        } />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
            <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
            <p className="text-gray-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary">Go home</a>
          </div>
        } />
      </Route>

    </Routes>
  )
}