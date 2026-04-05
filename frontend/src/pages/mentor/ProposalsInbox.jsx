import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, CheckCircle, XCircle, Filter } from 'lucide-react'
import { getMentorProposals, updateProposalStatus } from '../../api/proposals'
import { listProjects } from '../../api/projects'
import { useAuth } from '../../hooks/useAuth'
import ProposalCard from '../../components/proposals/ProposalCard'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ProposalsInbox() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [statusFilter,  setStatusFilter]  = useState('pending')
  const [projectFilter, setProjectFilter] = useState('')

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => listProjects().then(r => r.data),
  })
  const myProjects = projects.filter(p => p.mentor_email === user?.email)

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['mentor-proposals', statusFilter, projectFilter],
    queryFn: () => getMentorProposals({
      ...(statusFilter  ? { status: statusFilter }   : {}),
      ...(projectFilter ? { project: projectFilter } : {}),
    }).then(r => r.data),
  })

  const mut = useMutation({
    mutationFn: ({ id, status }) => updateProposalStatus(id, { status }),
    onSuccess: (_, { status }) => {
      toast.success(status === 'accepted' ? 'Proposal accepted — student enrolled!' : 'Proposal rejected')
      qc.invalidateQueries(['mentor-proposals'])
      qc.invalidateQueries(['mentor-dashboard'])
    },
    onError: e => toast.error(e.response?.data?.detail || e.response?.data?.non_field_errors?.[0] || 'Action failed'),
  })

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="Proposals inbox"
      subtitle={`${proposals.length} ${statusFilter || 'total'} proposal${proposals.length !== 1 ? 's' : ''}`}
    >
      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-400" />
          {['', 'pending', 'accepted', 'rejected'].map(s => (
            <button
              key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {myProjects.length > 1 && (
          <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="input text-sm max-w-xs">
            <option value="">All projects</option>
            {myProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        )}
      </div>

      {proposals.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No proposals"
          description={statusFilter === 'pending' ? 'No pending proposals. Students will apply once your project is live.' : 'No proposals match this filter.'}
        />
      ) : (
        <div className="space-y-4">
          {proposals.map(p => (
            <ProposalCard
              key={p.id}
              proposal={p}
              actions={
                p.status === 'pending' && (
                  <>
                    <button
                      onClick={() => mut.mutate({ id: p.id, status: 'accepted' })}
                      disabled={mut.isPending}
                      className="btn-success text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle size={13} /> Accept
                    </button>
                    <button
                      onClick={() => mut.mutate({ id: p.id, status: 'rejected' })}
                      disabled={mut.isPending}
                      className="btn-danger text-xs flex items-center gap-1.5"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )
              }
            />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}