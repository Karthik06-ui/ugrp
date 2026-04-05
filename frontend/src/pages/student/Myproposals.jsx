import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, BookOpen, ExternalLink, Paperclip } from 'lucide-react'
import { getStudentProposals } from '../../api/proposals'
import PageWrapper from '../../components/layout/PageWrapper'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import { PageSpinner } from '../../components/ui/Spinner'
import { format } from 'date-fns'

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'pending',  label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
]

// ── Empty state messages per tab ─────────────────────────────────────────────
const EMPTY = {
  all:      { title: 'No proposals yet',         desc: 'Browse open projects and submit your first proposal.' },
  pending:  { title: 'No pending proposals',     desc: 'All your proposals have already been reviewed.' },
  accepted: { title: 'No accepted proposals yet',desc: 'Keep applying — accepted proposals will appear here.' },
  rejected: { title: 'No rejected proposals',    desc: "Great — none of your proposals have been rejected yet." },
}

// ── Single proposal row card ─────────────────────────────────────────────────
function ProposalRow({ proposal }) {
  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-card-hover transition-shadow">
      {/* Project title + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <BookOpen size={15} className="text-brand-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <Link
              to={`/projects/${proposal.project}`}
              className="font-semibold text-gray-900 hover:text-brand-600 transition-colors text-sm leading-snug line-clamp-1"
            >
              {proposal.project_title || `Project #${proposal.project}`}
            </Link>
          </div>
        </div>
        <Badge status={proposal.status} />
      </div>

      {/* Message preview */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
        "{proposal.message}"
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Applied {format(new Date(proposal.created_at), 'MMM d, yyyy')}</span>
          {proposal.updated_at !== proposal.created_at && (
            <span>· Updated {format(new Date(proposal.updated_at), 'MMM d, yyyy')}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Attachment indicator */}
          {proposal.attachment_url && (
            <a
              href={proposal.attachment_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800
                         bg-brand-50 hover:bg-brand-100 border border-brand-200 px-2 py-1 rounded-lg transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <Paperclip size={11} /> Attachment
            </a>
          )}

          {/* View project link */}
          <Link
            to={`/projects/${proposal.project}`}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700
                       bg-white border border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors"
          >
            <ExternalLink size={11} /> View project
          </Link>
        </div>
      </div>

      {/* Accepted banner */}
      {proposal.status === 'accepted' && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium
                        rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
          You are enrolled in this project. Check your enrollments and tasks.
        </div>
      )}

      {/* Rejected banner — can re-apply */}
      {proposal.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium
                        rounded-lg px-3 py-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
            This proposal was rejected. You may re-apply to this project.
          </span>
          <Link
            to={`/projects/${proposal.project}`}
            className="underline underline-offset-2 hover:text-red-900 whitespace-nowrap flex-shrink-0"
          >
            Re-apply →
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function MyProposals() {
  const [activeTab, setActiveTab] = useState('all')

  // Fetch all proposals — no status filter, we filter client-side for instant tab switching
  const { data: allProposals = [], isLoading } = useQuery({
    queryKey: ['student-proposals'],
    queryFn:  () => getStudentProposals().then(r => r.data),
  })

  // Compute counts for each tab badge
  const counts = allProposals.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {})

  // Filter for active tab
  const visible = activeTab === 'all'
    ? allProposals
    : allProposals.filter(p => p.status === activeTab)

  if (isLoading) return <PageSpinner />

  return (
    <PageWrapper
      title="My proposals"
      subtitle="Track every project application you have submitted"
      actions={
        <Link to="/projects" className="btn-primary text-xs px-3 py-1.5 gap-1.5">
          <BookOpen size={13} /> Browse projects
        </Link>
      }
    >
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {TABS.map(({ key, label }) => {
          const count = key === 'all' ? allProposals.length : (counts[key] || 0)
          const isActive = activeTab === key

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all
                ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {label}
              {count > 0 && (
                <span className={`
                  inline-flex items-center justify-center min-w-[18px] h-[18px] px-1
                  rounded-full text-[10px] font-bold transition-colors
                  ${isActive
                    ? key === 'accepted' ? 'bg-teal-500  text-white'
                    : key === 'rejected' ? 'bg-red-400   text-white'
                    : key === 'pending'  ? 'bg-amber-400 text-white'
                    :                     'bg-brand-600  text-white'
                    : 'bg-gray-300 text-gray-600'}
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
              ? <Link to="/projects" className="btn-primary">Browse open projects</Link>
              : null
          }
        />
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {visible.length} {activeTab === 'all' ? 'total' : activeTab} proposal{visible.length !== 1 ? 's' : ''}
          </p>
          {visible.map(p => <ProposalRow key={p.id} proposal={p} />)}
        </div>
      )}
    </PageWrapper>
  )
}