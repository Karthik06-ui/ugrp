import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, BookOpen, ExternalLink } from 'lucide-react'
import { getStudentProposals, deleteProposal } from '../../api/proposals'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import { PageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'
import ProposalCard from '../../components/proposals/ProposalCard'

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Drafts' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
]

// ── Empty state messages per tab ─────────────────────────────────────────────
const EMPTY = {
  all: { title: 'No proposals yet', desc: 'Browse open projects and submit your first proposal.' },
  draft: { title: 'No draft proposals', desc: 'Any drafts you save will appear here for you to resume.' },
  pending: { title: 'No pending proposals', desc: 'All your proposals have already been reviewed.' },
  accepted: { title: 'No accepted proposals yet', desc: 'Keep applying — accepted proposals will appear here.' },
  rejected: { title: 'No rejected proposals', desc: "Great — none of your proposals have been rejected yet." },
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MyProposals() {
  const [activeTab, setActiveTab] = useState('all')
  const { user } = useAuth()
  const qc = useQueryClient()

  // Fetch all proposals
  const { data: allProposals = [], isLoading } = useQuery({
    queryKey: ['student-proposals'],
    queryFn: () => getStudentProposals().then(r => r.data),
  })

  // Delete draft proposal mutation
  const deleteMut = useMutation({
    mutationFn: deleteProposal,
    onSuccess: () => {
      toast.success('Draft proposal deleted successfully')
      qc.invalidateQueries(['student-proposals'])
    },
    onError: (e) => {
      toast.error(e.response?.data?.detail || 'Could not delete draft proposal')
    }
  })

  // Compute counts for each tab badge
  const counts = allProposals.reduce((acc, p) => {
    if (p.is_draft) {
      acc['draft'] = (acc['draft'] || 0) + 1
    } else {
      acc[p.status] = (acc[p.status] || 0) + 1
    }
    return acc
  }, {})

  // Filter for active tab
  const visible = activeTab === 'all'
    ? allProposals
    : activeTab === 'draft'
      ? allProposals.filter(p => p.is_draft)
      : allProposals.filter(p => p.status === activeTab && !p.is_draft)

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="My proposals"
      subtitle="Track every project application you have submitted"
      actions={
        <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800">
          <BookOpen size={13} /> Browse projects
        </Link>
      }
    >
      {/* Ambient glow container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[45%] rounded-full bg-sky-400/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-400/5 blur-[100px]" />
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 mb-8 bg-slate-50 border border-slate-100 p-1 rounded-2xl w-fit shadow-[0_2px_8px_rgba(15,23,42,0.01)] relative z-10">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? allProposals.length : (counts[key] || 0)
          const isActive = activeTab === key

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${isActive
                  ? 'bg-white text-slate-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100/50'
                  : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/30'}
              `}
            >
              {label}
              {count > 0 && (
                <span className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                  rounded-full text-[10px] font-extrabold transition-colors
                  ${isActive
                    ? key === 'accepted' ? 'bg-emerald-500 text-white'
                      : key === 'rejected' ? 'bg-rose-500 text-white'
                        : key === 'pending' ? 'bg-amber-500 text-white'
                          : key === 'draft' ? 'bg-slate-500 text-white'
                            : 'bg-indigo-650 text-white'
                    : 'bg-slate-200/80 text-slate-550'}
                `}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Proposal list ─────────────────────────────────────────────────── */}
      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={EMPTY[activeTab].title}
          description={EMPTY[activeTab].desc}
          action={
            activeTab === 'all' || activeTab === 'rejected'
              ? (
                <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-slate-800">
                  Browse open projects
                </Link>
              )
              : null
          }
        />
      ) : (
        <div className="space-y-6 relative z-10">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            {visible.length} {activeTab === 'all' ? 'total' : activeTab} proposal{visible.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map(p => {
              const isOwner = p.student === user?.user_id
              const cardActions = (
                <div className="flex items-center gap-2.5 flex-wrap">
                  {p.is_draft && isOwner && (
                    <>
                      <Link
                        to={`/projects/${p.project}`}
                        className="btn-primary text-xs flex items-center gap-1.5"
                      >
                        Resume Draft
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this draft?')) {
                            deleteMut.mutate(p.id)
                          }
                        }}
                        disabled={deleteMut.isPending}
                        className="btn-danger text-xs flex items-center gap-1.5"
                      >
                        Delete Draft
                      </button>
                    </>
                  )}
                  {!p.is_draft && (
                    <Link
                      to={`/projects/${p.project}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-650 bg-slate-50 border border-slate-150 hover:bg-slate-100 px-3.5 py-2 rounded-xl transition-all"
                    >
                      <ExternalLink size={12} /> View project
                    </Link>
                  )}
                </div>
              )
              return (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  actions={cardActions}
                />
              )
            })}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}