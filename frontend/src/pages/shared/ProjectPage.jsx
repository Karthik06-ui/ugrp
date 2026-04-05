import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter } from 'lucide-react'
import { listProjects } from '../../api/projects'
import ProjectCard from '../../components/projects/ProjectCard'
import PageWrapper from '../../components/layout/PageWrapper'
import { PageSpinner } from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { BookOpen } from 'lucide-react'

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })

  const projects = (data || []).filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'all' || p.status === status
    return matchSearch && matchStatus
  })

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper title="Research projects" subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} found`}>
      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-8" placeholder="Search by title or description…"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          {['all','open','closed'].map(s => (
            <button
              key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
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

      {projects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No projects found"
          description={search ? 'Try a different search term or clear the filter.' : 'No projects have been posted yet.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </PageWrapper>
  )
}