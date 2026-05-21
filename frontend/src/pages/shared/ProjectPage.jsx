import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, BookOpen, Building2 } from 'lucide-react'
import { listProjects } from '../../api/projects'
import ProjectCard from '../../components/projects/ProjectCard'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function ProjectsPage() {
  const [search,      setSearch]      = useState('')
  const [status,      setStatus]      = useState('all')
  const [projectType, setProjectType] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })

  const projects = (data || []).filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase()) ||
                        (p.industry_name || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all'      || p.status       === status
    const matchType   = projectType === 'all' || p.project_type === projectType
    return matchSearch && matchStatus && matchType
  })

  const academicCount = (data || []).filter(p => p.project_type === 'academic').length
  const industryCount = (data || []).filter(p => p.project_type === 'industry').length

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="Research projects"
      subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} found`}
    >
      {/* ── Summary type badges ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 rounded-xl text-xs font-medium text-brand-700">
          <BookOpen size={12} /> {academicCount} Academic
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-xl text-xs font-medium text-teal-700">
          <Building2 size={12} /> {industryCount} Industry
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8" placeholder="Search by title, description, or company…"
          />
        </div>

        {/* Project type filter */}
        <div className="flex items-center gap-1.5">
          {[
            { key: 'all',      label: 'All types' },
            { key: 'academic', label: '🎓 Academic', active_cls: 'bg-brand-600 text-white border-brand-600' },
            { key: 'industry', label: '🏢 Industry', active_cls: 'bg-teal-600  text-white border-teal-600'  },
          ].map(({ key, label, active_cls }) => (
            <button
              key={key} onClick={() => setProjectType(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                projectType === key
                  ? (active_cls || 'bg-gray-700 text-white border-gray-700')
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-gray-400" />
          {['all', 'open', 'closed'].map(s => (
            <button
              key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                status === s
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Project grid ─────────────────────────────────────────────────── */}
      {projects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No projects found"
          description={search ? 'Try a different search term or clear filters.' : 'No projects have been posted yet.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </PageWrapper>
  )
}